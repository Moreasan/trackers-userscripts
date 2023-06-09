import { parseImdbIdFromLink } from "../utils/utils";
import { tracker, Request } from "./tracker";
import tracker_tools from "common";

export default class NewInsane implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("newinsane.info");
  }

  async getSearchRequest(): Promise<Array<Request>> {
    const requests: Array<Request> = [];
    document
      .querySelectorAll("table.torrenttable tr.torrentrow")
      .forEach((element: HTMLElement) => {
        const imdbId = parseImdbIdFromLink(element);
        const request: Request = {
          torrents: [],
          dom: element as HTMLElement,
          imdbId,
          query: "",
        };
        requests.push(request);
      });

    return requests;
  }

  name(): string {
    return "NewInsane";
  }

  async canUpload(request: Request) {
    return !request.imdbId;
  }

  insertTrackersSelect(select: HTMLElement): void {
    tracker_tools.dom.addChild(
      document.querySelector(".searchbuttons.actiontitle") as HTMLElement,
      select
    );
  }
}
