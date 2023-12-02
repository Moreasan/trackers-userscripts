import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import { tracker, Request, toGenerator, MetaData } from "./tracker";
import { fetchAndParseHtml } from "common/http";
import { addChild } from "common/dom";

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

  yield* toGenerator(requests)
}

  name(): string {
    return "JPTV";
  }

  async canUpload(request: Request) {
    return false;
  }

  insertTrackersSelect(select: HTMLElement): void {
    addChild(
      document.querySelector(".form-torrent-search") as HTMLElement,
      select
    );
  }
}
