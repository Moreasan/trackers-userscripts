import { parseSize } from "../utils/utils";
import {
  MetaData,
  Request,
  SearchResult,
  toGenerator,
  AbstractTracker,
} from "./tracker";
import { addChild } from "common/dom";
import { fetchAndParseHtml } from "common/http";

export default class BLU extends AbstractTracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("blutopia.xyz") || url.includes("blutopia.cc");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const requests: Array<Request> = [];
    let nodes = Array.from(
      document.querySelectorAll(".torrent-search--list__results tbody tr")
    );
    yield {
      total: nodes.length,
    };
    for (let element of nodes) {
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
        dom: [element],
        imdbId,
        title: "",
      };
      yield request;
    }
  }

  name(): string {
    return "BLU";
  }

  async search(request: Request): Promise<SearchResult> {
    if (!request.imdbId) return SearchResult.NOT_CHECKED;
    const queryUrl =
      "https://blutopia.xyz/torrents?perPage=25&imdbId=" +
      request.imdbId +
      "&sortField=size";

    const result = await fetchAndParseHtml(queryUrl);

    return result.querySelector(".torrent-listings-no-result") !== null
      ? SearchResult.NOT_EXIST
      : SearchResult.EXIST;
  }

  insertTrackersSelect(select: HTMLElement): void {
    select.classList.add("form__select");
    const wrapper = document.createElement('div')
    wrapper.classList.add('panel_action')
    wrapper.appendChild(select)
    addChild(
      document.querySelectorAll(".panel__actions")[0] as HTMLElement,
      wrapper
    );
  }
}
