import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import { tracker, Request, toGenerator, MetaData } from "./tracker";
import { addChild } from "common/dom";

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
    const requests: Array<Request> = [];
    document.querySelectorAll(".torrent")?.forEach((element: HTMLElement) => {
      const imdbId = parseImdbIdFromLink(element);
      const size = parseSize(
        element.querySelector(".td-size")?.textContent as string
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
        title: "",
      };
      requests.push(request);
    });

  yield* toGenerator(requests)
}

  name(): string {
    return "TL";
  }

  async canUpload(request: Request) {
    return false;
  }

  insertTrackersSelect(select: HTMLElement): void {
    select.style.margin = "20px 0";
    select.style.padding = "2px 2px 3px 2px";
    select.style.color = "#111";
    addChild(
      document.querySelector(".sub-navbar") as HTMLElement,
      select
    );
  }
}
