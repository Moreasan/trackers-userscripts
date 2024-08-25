import { parseImdbIdFromLink, parseYearAndTitle } from "../utils/utils";
import {
  tracker,
  Request,
  MetaData,
  SearchResult,
  Category, AbstractTracker
} from "./tracker";
import { addChild } from "common/dom";
import { search, SearchResult as SR } from "common/searcher";
import { CZ as CZTracker } from "common/trackers";

export default class CinemaZ extends AbstractTracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("cinemaz.to");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const rows = document.querySelectorAll("#content-area > div.block > .row");
    let elements = Array.from(rows);
    if (rows.length === 1) {
      elements = Array.from(rows.item(0)!!.children);
    }
    yield {
      total: elements.length,
    };
    for (let element of elements) {
      const imdbId = parseImdbIdFromLink(element);
      const { title, year } = parseYearAndTitle(
        element.querySelector("a")?.getAttribute("title")
      );

      const request: Request = {
        torrents: [
          {
            dom: element,
          },
        ],
        dom: [element],
        imdbId,
        title,
        year,
        category: Category.MOVIE,
      };
      yield request;
    }
  }

  name(): string {
    return "CinemaZ";
  }

  async search(request: Request): Promise<SearchResult> {
    if (!request.imdbId) return SearchResult.NOT_CHECKED;
    const result = await search(CZTracker, {
      movie_title: "",
      movie_imdb_id: request.imdbId,
    });
    if (result == SR.LOGGED_OUT) return SearchResult.NOT_LOGGED_IN;
    return result == SR.NOT_FOUND ? SearchResult.NOT_EXIST : SearchResult.EXIST;

  }

  insertTrackersSelect(select: HTMLElement): void {
    addChild(
      document.querySelector("#content-area > div.well.well-sm") as HTMLElement,
      select
    );
  }
}
