import { fetchAndParseHtml, fetchUrl, sleep } from "../http";
import { Index } from "../trackers";

export type SearchOptions = {
  episode_id?: string;
  season_id?: string;
  series_id?: string;
  movie_year?: string;
  movie_imdb_id?: string;
  movie_title?: string;
  movie_original_title?: string;
  milkie_authToken?: string;
  tnt_authToken?: string;
};

export enum SearchResult {
  FOUND,
  NOT_FOUND,
  LOGGED_OUT,
  ERROR,
}

export const search = async (
  tracker: Index,
  options: SearchOptions
): Promise<SearchResult> => {
  const rate: number =
    "rateLimit" in tracker ? (tracker["rateLimit"] as number) : 200;
  const domain = tracker.searchUrl.split("/")[2];
  const now = new Date().getTime();
  let lastLoaded = window.localStorage[domain + "_lastLoaded"];
  if (!lastLoaded) {
    lastLoaded = now - 50000;
  } else {
    lastLoaded = parseInt(lastLoaded);
  }
  if (now - lastLoaded < rate) {
    await sleep(now - lastLoaded);
  } else {
    window.localStorage[domain + "_lastLoaded"] = new Date().getTime();
  }

  const success_match =
    "positiveMatch" in tracker ? tracker["positiveMatch"] : false;
  const searchUrl = await replaceSearchUrlParams(tracker, options);
  // Check tmdb/tvdb conversion.
  if (
    searchUrl.indexOf("=00000000") > -1 ||
    searchUrl.indexOf("=undefined") > -1
  ) {
    return SearchResult.ERROR;
  }
  // Check for results with POST method.
  let response;
  let reqHeader = {};
  if (tracker["name"] == "Milkie") {
    reqHeader = {
      Host: "milkie.cc",
      Authorization: options["milkie_authToken"] as string,
    };
  } else if (tracker["name"] == "TNT") {
    reqHeader = {
      Host: "tntracker.org",
      Authorization: options["tnt_authToken"],
    };
  } else if (tracker["name"] == "DonTor") {
    reqHeader = {
      Host: "dontorrent.ninja",
      Referer: "https://dontorrent.ninja",
    };
  }
  if ("mPOST" in tracker) {
    const post_data = await replaceSearchUrlParams(tracker, options);
    response = await fetchUrl(searchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        ...reqHeader,
      },
      body: post_data,
    });
  } else {
    response = await fetchUrl(searchUrl, {
      headers: reqHeader,
    });
  }
  if (
    tracker["positiveMatch"] &&
    tracker["loggedOutRegex"] &&
    response.match(tracker["loggedOutRegex"] as string)
  ) {
    return SearchResult.LOGGED_OUT;
  } else if (
    response.match(tracker["matchRegex"] as string)
      ? !success_match
      : success_match
  ) {
    return SearchResult.NOT_FOUND;
  } else if (
    tracker["loggedOutRegex"] &&
    response.match(tracker["loggedOutRegex"] as string)
  ) {
    return SearchResult.LOGGED_OUT;
  } else {
    return SearchResult.FOUND;
  }
};

const replaceSearchUrlParams = async (
  tracker: Index,
  options: SearchOptions
) => {
  let search_url: string =
    "mPOST" in tracker ? (tracker["mPOST"] as string) : tracker["searchUrl"];
  if ("goToUrl" in tracker) {
    search_url = tracker["goToUrl"] as string;
  }
  let movie_id = options.movie_imdb_id;
  if (options.movie_imdb_id) {
    if (search_url.match("%tvdbid%")) {
      movie_id = await getTVDbID(options.movie_imdb_id);
    } else if (search_url.match("%tmdbid%")) {
      movie_id = await getTMDbID(options.movie_imdb_id);
    } else if (search_url.match("%doubanid%")) {
      movie_id = await getDoubanID0(options.movie_imdb_id);
    }
    if (search_url.match("%doubanid%") && movie_id == "00000000") {
      movie_id = await getDoubanID1(options.movie_imdb_id);
    }
    if (search_url.match("%doubanid%") && movie_id == "00000000") {
      movie_id = await getDoubanID2(options.movie_imdb_id);
    }
    if (search_url.match("%doubanid%") && movie_id == "00000000") {
      movie_id = await getDoubanID3(options.movie_imdb_id);
    }
  }

  const space_replace =
    "spaceEncode" in tracker ? (tracker["spaceEncode"] as string) : "+";
  const search_string =
    options.movie_title ||
    ""
      .trim()
      .replace(/ +\(.*|&|:/g, "")
      .replace(/\s+/g, space_replace);
  const search_string_orig = options.movie_original_title
    ?.trim()
    .replace(/ +\(.*|&|:/g, "")
    .replace(/\s+/g, space_replace);
  return search_url
    .replace(/%tt%/g, movie_id as string)
    .replace(/%nott%/g, (movie_id as string).substring(2))
    .replace(/%tvdbid%/g, movie_id as string)
    .replace(/%tmdbid%/g, movie_id as string)
    .replace(/%doubanid%/g, movie_id as string)
    .replace(/%seriesid%/g, options.series_id as string)
    .replace(/%seasonid%/g, options.season_id as string)
    .replace(/%episodeid%/g, options.episode_id as string)
    .replace(/%search_string%/g, search_string)
    .replace(/%search_string_orig%/g, search_string_orig as string)
    .replace(/%year%/g, options.movie_year as string)
    .replace(/---/g, "-");
};

const getTVDbID = async (imdbID: string) => {
  const url =
    "https://thetvdb.com/api/GetSeriesByRemoteID.php?imdbid=" + imdbID;
  const response = await fetchUrl(url);
  if (response.match("seriesid")) {
    const xmldata = new DOMParser().parseFromString(
      response,
      "application/xml"
    );
    return xmldata.getElementsByTagName("seriesid")[0].childNodes[0]
      .nodeValue as string;
  }
  return "00000000";
};

const getTMDbID = async (imdbID: string) => {
  const url =
    "https://api.themoviedb.org/3/find/" +
    imdbID +
    "?api_key=d12b33d3f4fb8736dc06f22560c4f8d4&external_source=imdb_id";
  const response = await fetchUrl(url);
  const result = JSON.parse(response);
  if (result.movie_results && result.movie_results.length > 0) {
    return result.movie_results[0].id as string;
  } else if (result.tv_results && result.tv_results.length > 0) {
    return result.tv_results[0].id as string;
  } else if (
    result.tv_episode_results &&
    result.tv_episode_results.length > 0
  ) {
    return result.tv_episode_results[0].id as string;
  }
  return "00000000";
};

const getDoubanID0 = async (imdbID: string) => {
  const url = "https://movie.douban.com/j/subject_suggest?q=" + imdbID;
  const response = await fetchUrl(url);
  const result = JSON.parse(response);
  if (result && result.length) {
    return result[0].id as string;
  }
  return "00000000";
};

const getDoubanID1 = async (imdbID: string) => {
  const url = "https://www.douban.com/search?cat=1002&q=" + imdbID;
  const result = await fetchAndParseHtml(url);
  const element = result.querySelector("[onclick*=" + imdbID + "]");
  if (element) {
    const href = element.getAttribute("href");
    if (href && href.match(/subject%2F(\d+)/)) {
      return (href.match(/subject%2F(\d+)/) as Array<string>)[1];
    }
  }
  return "00000000";
};

const getDoubanID2 = async (imdbID: string) => {
  const url =
    'https://query.wikidata.org/sparql?format=json&query=SELECT * WHERE {?s wdt:P345 "' +
    imdbID +
    '". OPTIONAL { ?s wdt:P4529 ?Douban_film_ID. }}';
  const response = await fetchUrl(url);
  const result = JSON.parse(response);
  if (result.results.bindings[0] != undefined) {
    if (result.results.bindings[0].Douban_film_ID != undefined) {
      return result.results.bindings[0].Douban_film_ID.value as string;
    }
  }
  return "00000000";
};

const getDoubanID3 = async (imdbID: string) => {
  const url =
    'https://www.google.com/search?q="' +
    imdbID +
    '" site:https://movie.douban.com/subject&safe=off';
  const result = await fetchUrl(url);
  if (result.match("movie.douban.com/subject/")) {
    const x = result.split("movie.douban.com/subject/")[1];
    return x.split("/")[0];
  } else {
    return "00000000";
  }
};

export const getRottenID1 = async (imdbID: string) => {
  const url =
    'https://query.wikidata.org/sparql?format=json&query=SELECT * WHERE {?s wdt:P345 "' +
    imdbID +
    '". OPTIONAL { ?s wdt:P1258 ?Rotten_Tomatoes_ID. }}';
  const response = await fetchUrl(url);
  const result = JSON.parse(response);
  if (result.results.bindings[0] != undefined) {
    if (result.results.bindings[0].Rotten_Tomatoes_ID != undefined) {
      return result.results.bindings[0].Rotten_Tomatoes_ID.value as string;
    } else {
      return "00000000";
    }
  }
};
