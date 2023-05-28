import { parseImdbIdFromLink } from "../utils/utils";
import { tracker, Request } from "./tracker";
import tracker_tools from "common";

export default class CLANSUD implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return (
      url.includes("www.clan-sudamerica.net/invision/") &&
      !url.includes("forums/topic/")
    );
  }

  async getSearchRequest(): Promise<Array<Request>> {
    const requests: Array<Request> = [];
    const topics = document.querySelectorAll(
      'div[data-tableid="topics"] table'
    );
    for (const topic of topics) {
      if (
        topic.getAttribute("bgColor") != null &&
        !topic.getAttribute("bgcolor") != null
      ) {
        continue;
      }
      if (topic.querySelectorAll("img").length === 0) continue;

      if (topic.querySelectorAll("img").length != 3) continue;
      if (topic.querySelectorAll("img")[2].alt !== "peliscr.jpg") {
        (topic as HTMLElement).style.display = "none";
        continue;
      }
      const link = (topic.querySelector("a") as HTMLAnchorElement).href;
      let response = await tracker_tools.http.fetchAndParseHtml(link);
      const imdbId = parseImdbIdFromLink(response);
      const request: Request = {
        torrents: [],
        dom: topic as HTMLElement,
        imdbId,
        query: "",
      };
      requests.push(request);
    }

    return requests;
  }

  name(): string {
    return "CLAN-SUD";
  }

  async canUpload(request: Request) {
    return false;
  }

  insertTrackersSelect(select: HTMLElement): void {
    tracker_tools.dom.insertBefore(
      select,
      document.querySelector('div[data-tableid="topics"]') as HTMLElement
    );
  }
}
