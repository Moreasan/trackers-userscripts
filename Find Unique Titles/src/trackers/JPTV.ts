import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import {
  MetaData,
  Request,
  SearchResult,
  toGenerator,
  tracker,
} from "./tracker";
import { addChild } from "common/dom";
import { fetchAndParseHtml } from "common/http";

export default class JPTV implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return url.includes("jptv.club");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const requests: Array<Request> = [];
    let nodes = document.querySelectorAll(".view-torrent");
    for (const element of nodes) {
      let response = await fetchAndParseHtml(
        (element as HTMLAnchorElement).href
      );
      const imdbId = parseImdbIdFromLink(response as HTMLElement);
      const size = parseSize(
        document
          .querySelector(".view-torrent")
          .parentElement.parentElement.children[7].textContent.trim() as string
      );

      const request: Request = {
        torrents: [
          {
            size,
            tags: [],
            dom: element,
          },
        ],
        dom: [element as HTMLElement],
        imdbId,
        title: "",
      };
      requests.push(request);
    }

    yield* toGenerator(requests);
  }

  name(): string {
    return "JPTV";
  }

  async search(request: Request): Promise<SearchResult> {
    return SearchResult.NOT_CHECKED;
  }

  insertTrackersSelect(select: HTMLElement): void {
    addChild(
      document.querySelector(".form-torrent-search") as HTMLElement,
      select
    );
  }
}