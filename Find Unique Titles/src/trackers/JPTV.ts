import tracker_tools from "common";
import {parseImdbIdFromLink, parseSize} from "../utils/utils";
import {tracker, Request} from "./tracker";

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

  async getSearchRequest(): Promise<Array<Request>> {
    const requests: Array<Request> = [];
    let nodes = document.querySelectorAll('.view-torrent');
    for (const element of nodes) {
      let response = await tracker_tools.http.fetchAndParseHtml((element as HTMLAnchorElement).href)
      const imdbId = parseImdbIdFromLink(response as HTMLElement)
      const size = parseSize(document.querySelector('.view-torrent').parentElement.parentElement.children[7].textContent.trim()  as string)

      const request: Request = {
        data: {
          format: null,
          resolution: null,
          size,
          tags: null,
        },
        dom: element as HTMLElement,
        imdbId,
        query: "",
      };
      requests.push(request);
    }

    return requests;
  }

  name(): string {
    return "JPTV";
  }

  async canUpload(request: Request) {
    return false
  }

  insertTrackersSelect(select: HTMLElement): void {
    tracker_tools.dom.addChild(document.querySelector('.form-torrent-search') as HTMLElement, select)
  }
}
