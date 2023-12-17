import {
  parseImdbIdFromLink,
  parseResolution,
  parseSize,
  parseTags,
  parseYearAndTitle,
} from "../utils/utils";
import {
  Category,
  MetaData,
  Request,
  SearchResult,
  toGenerator,
  tracker,
} from "./tracker";
import { addChild, insertAfter } from "common/dom";
import { fetchAndParseHtml } from "common/http";
import { search, SearchResult as SR } from "common/searcher";
import { Aither as AitherTracker } from "common/trackers";

const parseCategory = (element: HTMLElement): Category | undefined => {
  const categoryLink = element.querySelector(".torrent__category-link");
  if (!categoryLink) {
    return undefined;
  }
  const categoryName = categoryLink.textContent?.trim();
  if (categoryName == "TV") return Category.TV;
  if (categoryName == "Movie") return Category.MOVIE;

  return undefined;
};
export default class Aither implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("aither.cc");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const elements = Array.from(document.querySelectorAll(".panelV2 tbody tr"));
    yield {
      total: elements.length,
    };
    for (let element of elements) {
      let linkElement = element.querySelector(
        ".torrent-search--list__name"
      )!! as HTMLAnchorElement;
      const link = linkElement.href;
      let response = await fetchAndParseHtml(link);

      const imdbId = parseImdbIdFromLink(response);
      const category = parseCategory(response);
      let torrentName = linkElement.textContent!!.trim();
      const { title, year } = parseYearAndTitle(torrentName);
      let size = parseSize(
        element
          .querySelector(".torrent-search--list__size")!!
          .textContent!!.trim()
      );
      const request: Request = {
        torrents: [
          {
            size,
            tags: parseTags(torrentName),
            dom: element,
            resolution: parseResolution(torrentName),
          },
        ],
        dom: [element],
        imdbId,
        title,
        year,
        category,
      };
      yield request;
    }
  }

  name(): string {
    return "Aither";
  }

  async search(request: Request): Promise<SearchResult> {
    if (request.category !== Category.MOVIE && request.category !== Category.TV)
      return SearchResult.NOT_CHECKED;
    if (!request.imdbId) return SearchResult.NOT_CHECKED;

    const result = await search(AitherTracker, {
      movie_title: "",
      movie_imdb_id: request.imdbId,
    });
    if (result == SR.LOGGED_OUT) return SearchResult.NOT_LOGGED_IN;
    return result == SR.NOT_FOUND ? SearchResult.NOT_EXIST : SearchResult.EXIST;
  }

  insertTrackersSelect(select: HTMLElement): void {
    const parent = document.querySelector(".panelV2 .panel__header");
    if (!parent) return;
    const div = document.createElement("div");
    select.style.width = "170px";
    div.classList.add("form__group");
    select.classList.add("form__select");
    addChild(div, select);
    insertAfter(div, parent.querySelector("h2")!!);
  }
}
