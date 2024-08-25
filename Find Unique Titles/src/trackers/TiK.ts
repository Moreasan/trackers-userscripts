import { parseSize } from "../utils/utils";
import { MetaData, Request, SearchResult, AbstractTracker } from "./tracker";
import { search, SearchResult as SR } from "common/searcher";
import { Tik as TikTracker } from "common/trackers";
import { addChild } from "common/dom";

export default class TiK extends AbstractTracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("cinematik.net");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    let elements = Array.from(
      document.querySelectorAll(".torrent-search--list__results tbody tr")
    ) as Array<HTMLElement>;
    yield {
      total: elements.length,
    };
    for (let element of elements) {
      let imdbId = "tt" + element.getAttribute("data-imdb-id");

      let size = parseSize(
        element.querySelector(".torrent-search--list__size")!.textContent!
      );
      const request: Request = {
        torrents: [
          {
            size,
            tags: [],
            dom: element,
          },
        ],
        dom: element,
        imdbId,
        query: "",
      };
      yield request;
    }
  }

  name(): string {
    return "TiK";
  }

  async search(request: Request): Promise<SearchResult> {
    if (!request.imdbId) return SearchResult.NOT_CHECKED;
    const result = await search(TikTracker, {
      movie_title: "",
      movie_imdb_id: request.imdbId,
    });
    if (result == SR.LOGGED_OUT) return SearchResult.NOT_LOGGED_IN;
    return result == SR.NOT_FOUND ? SearchResult.NOT_EXIST : SearchResult.EXIST;
  }

  insertTrackersSelect(select: HTMLElement): void {
    select.classList.add("form__select");
    addChild(
      document.querySelectorAll(".panel__actions")[1] as HTMLElement,
      select
    );
  }
}
