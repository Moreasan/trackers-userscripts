import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import { tracker, Request } from "./tracker";
import tracker_tools from "common";

export default class MTeam implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return url.includes("https://ncore.pro");
  }

  async getSearchRequest(): Promise<Array<Request>> {
    const requests: Array<Request> = [];
    for (const element of document.querySelectorAll(".box_torrent")) {

      const imdbId = parseImdbIdFromLink(element);
      const size = parseSize(element.children[1].children[4].textContent as string);

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
    }

    return requests;
  }

  name(): string {
    return "nCore";
  }

  async canUpload(request: Request) {
    return false;
  }

  insertTrackersSelect(select: HTMLElement): void {
    const element = document.querySelector("#keresoresz tr");
    tracker_tools.dom.addChild(element as HTMLElement, select);
  }
}
