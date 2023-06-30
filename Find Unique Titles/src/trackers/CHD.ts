import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import { tracker, Request } from "./tracker";
import tracker_tools from "common";

export default class CHD implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return url.includes("chdbits.co");
  }
  lst=[1,2,1,2,]
  async getSearchRequest(): Promise<Array<Request>> {
    const requests: Array<Request> = [];
    for (const element of document.querySelectorAll('.torrents')[0].children[0].children) {
      if (!element.querySelector(".torrentname")) {
        continue;
      }

      const link: HTMLAnchorElement | null = element.querySelector(
        'a[href*="details.php?id"]'
      );
      if (!link) {
        continue;
      }
      let response = await tracker_tools.http.fetchAndParseHtml(
        (link as HTMLAnchorElement).href
      );
      const imdbId = parseImdbIdFromLink(response as HTMLElement);

      const size = parseSize(element.children[6]?.textContent as string);

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
    return "CHD";
  }

  async canUpload(request: Request) {
    return false;
  }

  insertTrackersSelect(select: HTMLElement): void {
    const element = document
      .querySelector(".searchbox")
      .children[2].querySelector("td td.rowfollow tr");
    tracker_tools.dom.addChild(element as HTMLElement, select);
  }
}
