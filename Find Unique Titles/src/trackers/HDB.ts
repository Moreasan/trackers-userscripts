import {
  parseImdbId,
  parseResolution,
  parseSize,
} from "../utils/utils";
import {
  tracker,
  Request,
  toGenerator,
  MetaData,
  Torrent,
  Category, SearchResult
} from "./tracker";
import { fetchAndParseHtml } from "common/http";
import { addChild } from "common/dom";

const isExclusive = (element: HTMLElement) => {
  const exclusiveLink = element.querySelector(
    'a[href="/browse.php?exclusive=1"]'
  );
  return exclusiveLink != null;
};

function parseTorrent(element: HTMLElement): Torrent {
  const size = parseSize(
    element.querySelector("td:nth-child(6)")?.textContent as string
  );
  const title = element
    .querySelector(".browse_td_name_cell a")
    .textContent.trim();
  const resolution = parseResolution(title);
  const tags = [];
  if (element.querySelector("#codec1 .medium5")) {
    tags.push("Remux");
  }

  return {
    size,
    tags,
    dom: element,
    resolution,
  };
}

function parseCategory(element: HTMLElement) {
  const category = element
    .querySelector(".catcell a")
    .getAttribute("href")
    .replace("?cat=", "");
  switch (category) {
    case "1":
      return Category.MOVIE;
    case "2":
      return Category.TV;
    case "3":
      return Category.DOCUMENTARY;
    case "4":
      return Category.MUSIC;
    case "5":
      return Category.SPORT;
    case "6":
      return Category.MUSIC;
    case "7":
      return Category.XXX;
  }
}

export default class HDB implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("hdbits.org");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const requests: Array<Request> = [];
    document
      .querySelectorAll("#torrent-list > tbody tr")
      ?.forEach((element: HTMLElement) => {
        if (isExclusive(element)) {
          element.style.display = "none";
          return;
        }
        const imdbId = parseImdbId(
          element
            .querySelector("a[data-imdb-link]")
            ?.getAttribute("data-imdb-link")
        );

        const request: Request = {
          torrents: [parseTorrent(element)],
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
    return "HDB";
  }

  async search(request: Request): Promise<SearchResult> {
    if (!request.imdbId) return SearchResult.NOT_CHECKED;
    const queryUrl =
      "https://hdbits.org/browse.php?c3=1&c1=1&c2=1&tagsearchtype=or&imdb=" +
      request.imdbId +
      "&sort=size&h=8&d=DESC";

    const result = await fetchAndParseHtml(queryUrl);

    return result
      .querySelector("#resultsarea")
      .textContent.includes("Nothing here!") ? SearchResult.NOT_EXIST
      : SearchResult.EXIST;
  }

  insertTrackersSelect(select: HTMLElement): void {
    document.querySelector("#moresearch3 > td:nth-child(2)").innerHTML +=
      "<br><br>Find unique for:<br>";
    addChild(
      document.querySelector("#moresearch3 > td:nth-child(2)") as HTMLElement,
      select
    );
  }
}
