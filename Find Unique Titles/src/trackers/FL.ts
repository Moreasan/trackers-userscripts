import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import { tracker, Request, MetaData, SearchResult } from "./tracker";
import { addChild } from "common/dom";
import { fetchAndParseHtml } from "common/http";
import url from "url";

export default class FL implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("filelist.io");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    let nodes = document.querySelectorAll(".torrentrow");
    yield {
      total: nodes.length,
    };
    for (const element of nodes) {
      const link: HTMLAnchorElement | null = element.querySelector(
        'a[href*="details.php?id"]'
      );
      if (!link) {
        continue;
      }
      let response = await fetchAndParseHtml((link as HTMLAnchorElement).href);
      const imdbId = parseImdbIdFromLink(response as HTMLElement);
      const size = parseSize(
        element.querySelector(".torrenttable:nth-child(7)")
          ?.textContent as string
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
      yield request;
    }
  }

  name(): string {
    return "FL";
  }

  async search(request: Request): Promise<SearchResult> {
    if (!request.imdbId) return SearchResult.NOT_CHECKED;
    const queryUrl =
      "https://filelist.io/browse.php?search=" +
      request.imdbId +
      "&cat=0&searchin=1&sort=3";

    const result = await fetchAndParseHtml(queryUrl);

    return result.querySelectorAll(".torrentrow").length === 0
      ? SearchResult.NOT_EXIST
      : SearchResult.EXIST;
  }

  insertTrackersSelect(select: HTMLElement): void {
    addChild(document.querySelector("form p") as HTMLElement, select);
  }
}
