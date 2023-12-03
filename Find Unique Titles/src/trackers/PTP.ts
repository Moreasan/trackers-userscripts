import { addToMemoryCache, getFromMemoryCache } from "../utils/cache";
import {
  parseImdbIdFromLink,
  parseResolution,
  parseSize,
} from "../utils/utils";
import {
  Category,
  MetaData,
  Request,
  SearchResult,
  toGenerator,
  Torrent,
  tracker,
} from "./tracker";
import { findFirst, insertBefore } from "common/dom";
import { fetchAndParseHtml } from "common/http";
import { logger } from "common/logger";

function isSupportedCategory(category: Category | undefined) {
  return (
    category === undefined ||
    category === Category.MOVIE ||
    category === Category.DOCUMENTARY ||
    category === Category.LIVE_PERFORMANCE
  );
}

const parseTorrents = (element: HTMLElement) => {
  const torrents = [];
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
      let title = element.querySelector(".torrent-info-link").textContent;
      const resolution = parseResolution(title);
      const tags = [];
      if (title.includes("Remux")) {
        tags.push("Remux");
      }
      const torrent: Torrent = {
        dom: [element],
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

const hasRequests = (element: Element) => {
  return element
    .querySelector("#no_results_message")!!
    .textContent!!.trim()
    .includes(
      "Your search did not match any torrents, however it did match these requests."
    );
};
export default class PTP implements tracker {
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
    const requests: Array<Request> = [];
    const nodes = findFirst(
      document,
      "#torrents-movie-view table.torrent_table > tbody",
      "table.torrent_table > tbody tr.basic-movie-list__details-row",
      ".cover-movie-list__movie"
    );
    nodes?.forEach((element: HTMLElement) => {
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
      requests.push(request);
    });

    yield* toGenerator(requests);
  }

  name(): string {
    return "PTP";
  }

  async search(request: Request): Promise<SearchResult> {
    if (!isSupportedCategory(request.category)) return SearchResult.NOT_ALLOWED;
    let torrents = [];
    let result;
    if (!request.imdbId) {
      logger.debug("NO IMDB ID was provided");
      if (request.title && request.year) {
        logger.debug(
          "Searching by title and year: {0} - {1}",
          request.title,
          request.year
        );
        const query_url = `https://passthepopcorn.me/torrents.php?action=advanced&searchstr=${encodeURIComponent(
          request.title
        )}&year=${request.year}`;
        result = await fetchAndParseHtml(query_url);
        torrents = parseAvailableTorrents(result);
      } else {
        return SearchResult.NOT_CHECKED
      }
    } else {
      torrents = getFromMemoryCache(request.imdbId);
      if (!torrents) {
        const query_url =
          "https://passthepopcorn.me/torrents.php?imdb=" + request.imdbId;
        result = await fetchAndParseHtml(query_url);
        torrents = parseAvailableTorrents(result);
        addToMemoryCache(request.imdbId, torrents);
      }
    }
    let notFound = !torrents.length;
    if (notFound) {
      if (result && hasRequests(result)) {
        if (request.imdbId) {
          return SearchResult.NOT_EXIST_WITH_REQUEST;
        } else {
          return SearchResult.MAYBE_NOT_EXIST_WITH_REQUEST;
        }
      }
      if (request.imdbId) {
        return SearchResult.NOT_EXIST
      } else {
        return SearchResult.MAYBE_NOT_EXIST
      }
    }
    let searchResult: SearchResult = SearchResult.EXIST
    for (let torrent of request.torrents) {
      if (searchTorrent(torrent, torrents)) {
        searchResult = SearchResult.EXIST_BUT_MISSING_SLOT;
      } else {
        torrent.dom.style.display = "none";
      }
    }
    return searchResult;
  }

  insertTrackersSelect(select: HTMLSelectElement): void {
    let element = document.querySelector(".search-form__footer__buttons");
    if (!element) return;
    insertBefore(select, element as HTMLElement);
  }
}

const parseAvailableTorrents = (result: HTMLElement): Array<Torrent> => {
  const torrents: Array<Torrent> = [];
  result
    .querySelectorAll('#torrent-table tr[id^="group_torrent_header_"]')
    .forEach((line) => {
      const data = line.children[0]?.textContent?.trim().split("/");
      const size = parseSize(line.children[1]?.textContent?.trim());
      const tags = [];
      if (line.textContent?.includes("Remux")) {
        tags.push("Remux");
      }
      const torrent: Torrent = {
        container: data[0].split("]")[1].trim(),
        format: data[1].trim(),
        resolution: data[3].trim(),
        tags: tags,
        size,
        dom: line as HTMLElement,
      };
      torrents.push(torrent);
    });
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

function isSD(resolution: string) {
  const sdResolutions = ["SD", "PAL", "NTSC"];
  if (sdResolutions.indexOf(resolution.toUpperCase())) return true;
  let height = resolution.replace("p", "");
  if (resolution.includes("x")) {
    height = resolution.split("x")[1];
  }
  if (parseInt(height) && parseInt(height) < 720) return true;
}

function sameResolution(first: Torrent, second: Torrent) {
  if (!first.resolution || !second.resolution) return true;
  if (first.resolution === second.resolution) return true;
  if (first.resolution === "SD") return isSD(second.resolution);
  if (second.resolution === "SD") return isSD(first.resolution);
}

const searchTorrent = (torrent: Torrent, availableTorrents: Array<Torrent>) => {
  const similarTorrents = availableTorrents.filter((e) => {
    return (
      sameResolution(torrent, e) &&
      (torrent.container === undefined ||
        sameContainer(e.container, torrent.container)) &&
      (!torrent.tags.includes("Remux") || e.tags.includes("Remux"))
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