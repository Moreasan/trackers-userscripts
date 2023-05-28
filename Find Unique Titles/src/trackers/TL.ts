import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import { tracker, Request } from "./tracker";
import tracker_tools from "common";

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

  async getSearchRequest(): Promise<Array<Request>> {
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
        query: "",
      };
      requests.push(request);
    });

    return requests;
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
    tracker_tools.dom.addChild(
      document.querySelector(".sub-navbar") as HTMLElement,
      select
    );
  }
}
