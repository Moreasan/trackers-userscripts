import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import {
  MetaData,
  Request,
  SearchResult,
  toGenerator,
  tracker,
} from "./tracker";
import { addChild } from "common/dom";

export default class HDSky implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return url.includes("hdsky.me");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const requests: Array<Request> = [];
    for (const element of document.querySelectorAll(".torrents")[0].children[0]
      .children) {
      if (!element.querySelector(".torrentname")) {
        continue;
      }
      const imdbId = parseImdbIdFromLink(element.querySelector(".torrentname"));
      const size = parseSize(element.children[6]?.textContent as string);

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
      requests.push(request);
    }

    yield* toGenerator(requests);
  }

  name(): string {
    return "HDSky";
  }

  async search(request: Request): Promise<SearchResult> {
    return SearchResult.NOT_CHECKED;
  }

  insertTrackersSelect(select: HTMLElement): void {
    const element = document
      .querySelector(".searchbox")
      .children[2].querySelector("td td.rowfollow tr");
    addChild(element as HTMLElement, select);
  }
}