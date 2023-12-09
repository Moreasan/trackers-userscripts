import {
  parseCodec,
  parseImdbIdFromLink,
  parseResolution,
  parseSize,
  parseTags,
} from "../utils/utils";
import { Category, MetaData, Request, SearchResult, tracker } from "./tracker";
import { addChild } from "common/dom";
import { logger } from "common/logger";

const parseCategory = (element: Element) => {
  const category = element
    .querySelector(".info a.category")!!
    .getAttribute("data-ccid");
  if (category == "animation") return Category.ANIME;
  if (category == "tv") return Category.TV;
  if (category == "music") return Category.MUSIC;
  if (category == "games") return Category.GAME;
  if (category == "movies") return Category.MOVIE;
  if (category == "books") return Category.BOOK;
};
const parseYearAndTitle = (element: Element) => {
  const name = element.querySelector(".name a")!!.childNodes[0].textContent!!;
  const regex = /^(.*?)\s+(\d{4})\s+(.*)$/;
  const match = name.match(regex);

  if (match) {
    const title = match[1].trim();
    const year = parseInt(match[2], 10);

    return { title, year };
  }

  return { title: undefined, year: undefined };
};
export default class TL implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return url.includes("torrentleech.org");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    logger.debug(`[{0}] Parsing titles to check`, this.name());
    const elements = Array.from(document.querySelectorAll(".torrent"));
    yield {
      total: elements.length,
    };
    for (let element of elements) {
      const torrentTitle = element.querySelector(".name a")!!.childNodes[0].textContent!!;
      logger.debug("[TL] Checking torrent: {0}", torrentTitle)
      const imdbId = parseImdbIdFromLink(element as HTMLElement);
      const size = parseSize(
        element.querySelector(".td-size")?.textContent as string
      );
      const category = parseCategory(element);
      let title;
      let year = undefined;
      if (category == Category.MOVIE) {
        ({ title, year } = parseYearAndTitle(element));

      }
      const request: Request = {
        torrents: [
          {
            size,
            tags: parseTags(torrentTitle),
            dom: element as HTMLElement,
            resolution: parseResolution(torrentTitle),
            container: parseCodec(torrentTitle),
          },
        ],
        dom: [element as HTMLElement],
        imdbId,
        title,
        year,
        category,
      };
      yield request;
    }
  }

  name(): string {
    return "TL";
  }

  async search(request: Request): Promise<SearchResult> {
    return SearchResult.NOT_CHECKED;
  }

  insertTrackersSelect(select: HTMLElement): void {
    select.style.margin = "20px 0";
    select.style.padding = "2px 2px 3px 2px";
    select.style.color = "#111";
    addChild(document.querySelector(".sub-navbar") as HTMLElement, select);
  }
}
