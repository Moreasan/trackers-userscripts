import { addToMemoryCache, getFromMemoryCache } from "../utils/cache";
import {
  parseCodec,
  parseImdbIdFromLink,
  parseResolution,
  parseSize,
  parseTags,
} from "../utils/utils";
import {
  Category,
  MetaData,
  MovieRequest,
  Request,
  Resolution,
  SearchResult,
  Torrent,
  AbstractTracker,
} from "./tracker";
import { findFirst, insertBefore } from "common/dom";
import { fetchAndParseHtml } from "common/http";
import { logger } from "common/logger";

const BANNED_RELEASE_GROUPS = [
  "aXXo",
  "BMDRu",
  "BRrip",
  "CM8",
  "CrEwSaDe",
  "CTFOH",
  "d3g",
  "DNL",
  "FaNGDiNG0",
  "HD2DVD",
  "HDTime",
  "ION10",
  "iPlanet",
  "KiNGDOM",
  "mHD",
  "mSD",
  "nHD",
  "nikt0",
  "nSD",
  "NhaNc3",
  "OFT",
  "PRODJi",
  "SANTi",
  "SPiRiT",
  "STUTTERSHIT",
  "ViSION",
  "VXT",
  "WAF",
  "x0r",
  "YIFY",
  "OFT",
  "BHDStudio",
  "nikt0",
  "HDT",
  "LAMA",
  "WORLD",
  "SasukeducK",
  "SPiRiT",
];

function isSupportedCategory(category: Category | undefined) {
  return (
    category === undefined ||
    category === Category.MOVIE ||
    category === Category.DOCUMENTARY ||
    category === Category.LIVE_PERFORMANCE
  );
}

const parseTorrents = (element: HTMLElement) => {
  const torrents: Array<Torrent> = [];
  if (element.classList.contains("cover-movie-list__movie")) {
    return [];
  }
  element
    .querySelectorAll("tr.basic-movie-list__torrent-row")
    .forEach((element: HTMLElement) => {
      if (element.querySelector(".basic-movie-list__torrent-edition")) {
        return;
      }
      const size = parseSize(element.children[2].textContent);
      let title = element.querySelector(".torrent-info-link")!!.textContent!!;
      const resolution = parseResolution(title);
      const tags = [];
      if (title.includes("Remux")) {
        tags.push("Remux");
      }
      const torrent: Torrent = {
        dom: element,
        size,
        tags,
        resolution,
      };
      torrents.push(torrent);
    });
  return torrents;
};

const parseCategory = (element: HTMLElement): Category => {
  const categoryTitle = element.querySelector(
    ".basic-movie-list__torrent-edition__main"
  )?.textContent;
  if (!categoryTitle) {
    return null;
  }
  if (categoryTitle.includes("Stand-up Comedy ")) {
    return Category.STAND_UP;
  } else if (categoryTitle.includes("Live Performance ")) {
    return Category.LIVE_PERFORMANCE;
  } else {
    return Category.MOVIE;
  }
};

const hasRequests = (element: Element): boolean => {
  return (
    element
      .querySelector("#no_results_message")
      ?.textContent?.trim()
      .includes(
        "Your search did not match any torrents, however it did match these requests."
      ) === true
  );
};

const isAllowedTorrent = (torrent: Torrent) => {
  if (
    torrent.container === "x265" &&
    torrent.resolution !== Resolution.UHD &&
    !isHDR(torrent)
  ) {
    logger.debug("[PTP] Torrent not allowed: non HDR X265 and not 2160p");
    return false;
  }
  if (BANNED_RELEASE_GROUPS.includes(torrent.releaseGroup)) {
    logger.debug(
      `[PTP] Torrent not allowed: banned release group: ${torrent.releaseGroup}`
    );
    return false;
  }
  return true;
};

export default class PTP extends AbstractTracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("passthepopcorn.me");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const nodes = findFirst(
      document.body,
      "#torrents-movie-view table.torrent_table > tbody",
      "table.torrent_table > tbody tr.basic-movie-list__details-row",
      ".cover-movie-list__movie"
    ) as Array<HTMLElement>;
    yield {
      total: nodes.length,
    };
    for (let element of nodes) {
      let elements = findFirst(
        element,
        ".basic-movie-list__movie__ratings-and-tags",
        ".cover-movie-list__movie__rating-and-tags"
      );

      const imdbId = elements
        ? parseImdbIdFromLink(elements[0] as HTMLElement)
        : null;

      const request: Request = {
        torrents: parseTorrents(element),
        dom: [element as HTMLElement],
        imdbId,
        title: "",
        category: parseCategory(element),
      };
      yield request;
    }
  }

  name(): string {
    return "PTP";
  }

  async search(request: Request): Promise<SearchResult> {
    if (!this.isAllowed(request)) return SearchResult.NOT_ALLOWED;
    if (
      request.torrents.filter((torrent: Torrent) => isAllowedTorrent(torrent))
        .length === 0
    ) {
      return SearchResult.NOT_ALLOWED;
    }
    let torrents: Array<Torrent> = [];
    let result;
    const moviesRequest = request as MovieRequest;
    if (!moviesRequest.imdbId) {
      logger.debug("NO IMDB ID was provided");
      if (moviesRequest.title && moviesRequest.year) {
        logger.debug(
          "Searching by title and year: {0} - {1}",
          moviesRequest.title,
          moviesRequest.year
        );
        const query_url = `https://passthepopcorn.me/torrents.php?action=advanced&searchstr=${encodeURIComponent(
          moviesRequest.title
        )}&year=${moviesRequest.year}`;
        result = await fetchAndParseHtml(query_url);
        let searchResultsCount = result.querySelector(
          "span.search-form__footer__results"
        );
        if (
          searchResultsCount &&
          searchResultsCount.textContent?.trim()?.split(" ")[0] !== "0"
        ) {
          logger.debug(
            "[PTP] Multiple results found: {0}",
            searchResultsCount.textContent
          );
          const torrentsData = extractJsonData(result);
          for (let movie of torrentsData["Movies"]) {
            logger.debug("[PTP] Found search result: {0}", movie);
            if (
              movie["Title"].trim() === moviesRequest.title &&
              parseInt(movie["Year"].trim()) === moviesRequest.year
            ) {
              logger.debug("[PTP] Found a title with 100% match");
              for (let group of movie["GroupingQualities"]) {
                for (let torrent of group["Torrents"]) {
                  torrents.push({
                    size: parseSize(torrent["Size"]),
                    tags: parseTags(torrent["Title"]),
                    resolution: parseResolution(torrent["Title"]),
                    container: parseCodec(torrent["Title"]),
                  });
                }
              }
              logger.debug("[PTP] Parsed torrents: {0}", torrents);
              break;
            }
          }
        } else {
          torrents = parseAvailableTorrents(result);
        }
      } else {
        return SearchResult.NOT_CHECKED;
      }
    } else {
      torrents = getFromMemoryCache(moviesRequest.imdbId);
      if (!torrents) {
        const query_url =
          "https://passthepopcorn.me/torrents.php?imdb=" + moviesRequest.imdbId;
        result = await fetchAndParseHtml(query_url);
        torrents = parseAvailableTorrents(result);
        addToMemoryCache(moviesRequest.imdbId, torrents);
      }
    }
    let notFound = !torrents.length;
    if (notFound) {
      if (result && hasRequests(result)) {
        if (moviesRequest.imdbId) {
          return SearchResult.NOT_EXIST_WITH_REQUEST;
        } else {
          return SearchResult.MAYBE_NOT_EXIST_WITH_REQUEST;
        }
      }
      if (moviesRequest.imdbId) {
        return SearchResult.NOT_EXIST;
      } else {
        return SearchResult.MAYBE_NOT_EXIST;
      }
    }
    let searchResult: SearchResult = SearchResult.EXIST;
    for (let torrent of moviesRequest.torrents) {
      if (searchTorrent(torrent, torrents)) {
        searchResult = SearchResult.EXIST_BUT_MISSING_SLOT;
      } else {
        torrent.dom.style.display = "none";
      }
    }
    return searchResult;
  }

  private isAllowed(request: Request): boolean {
    if (!isSupportedCategory(request.category)) return false;

    return true;
  }

  insertTrackersSelect(select: HTMLSelectElement): void {
    let element = document.querySelector(".search-form__footer__buttons");
    if (!element) return;
    insertBefore(select, element as HTMLElement);
  }
}

const parseAvailableTorrents = (result: HTMLElement): Array<Torrent> => {
  const lines = Array.from(
    result.querySelectorAll('#torrent-table tr[id^="group_torrent_header_"]')
  );
  return parseTorrentsFromLines(lines);
};

const parseTorrentsFromLines = (lines: Array<Element>) => {
  const torrents: Torrent[] = [];
  for (let line of lines) {
    const data = line.children[0]?.textContent?.trim().split("/")!!;
    const size = parseSize(line.children[1]?.textContent?.trim());
    const tags = [];
    if (line.textContent?.includes("Remux")) {
      tags.push("Remux");
    }
    const torrent: Torrent = {
      container: data[0].split("]")[1].trim(),
      format: data[1].trim(),
      resolution: parseResolution(data[3].trim()),
      tags: tags,
      size,
      dom: line as HTMLElement,
    };
    torrents.push(torrent);
  }
  return torrents;
};

function sameContainer(first: string, second: string) {
  return (
    first === second ||
    (first === "H.264" && second === "x264") ||
    (first === "x264" && second === "H.264") ||
    (first === "H.265" && second === "x265") ||
    (first === "x265" && second === "H.265") ||
    (first === "UHD100" && second === "BD100") ||
    (first === "BD100" && second === "UHD100") ||
    (first === "UHD66" && second === "BD66") ||
    (first === "BD66" && second === "UHD66")
  );
}

const isSD = (resolution: Resolution) => {
  return resolution === Resolution.SD;
};

function sameResolution(first: Torrent, second: Torrent) {
  if (!first.resolution || !second.resolution) return true;
  return first.resolution === second.resolution;
}

const isHDR = (torrent: Torrent) => {
  return torrent.tags?.includes("HDR") || torrent.tags?.includes("DV");
};

const searchTorrent = (torrent: Torrent, availableTorrents: Array<Torrent>) => {
  const similarTorrents = availableTorrents.filter((e) => {
    return (
      sameResolution(torrent, e) &&
      (torrent.container === undefined ||
        sameContainer(e.container, torrent.container)) &&
      (!torrent.tags?.includes("Remux") || e.tags?.includes("Remux"))
    );
  });
  if (similarTorrents.length == 0 && torrent.resolution && torrent.container) {
    return true;
  }
  if (similarTorrents.length == 1) {
    if (
      torrent.size > similarTorrents[0].size * 1.5 ||
      similarTorrents[0].size > torrent.size * 1.5
    ) {
      return true;
    }
  }
  return false;
};

function extractJsonData(doc: Element) {
  const scriptElements = Array.from(doc.querySelectorAll("script"));

  for (const scriptElement of scriptElements) {
    let scriptContent = scriptElement.textContent!!.trim();
    if (scriptContent.includes("PageData")) {
      const startIndex = scriptContent.indexOf("var PageData =") + 14;
      const jsonVariable = scriptContent.substring(
        startIndex,
        scriptContent.length - 1
      );

      try {
        return JSON.parse(jsonVariable);
      } catch (error) {
        console.error("Error extracting JSON:", error);
        return null;
      }
    }
  }

  console.error(`No script element containing PageData found.`);
  return null;
}
