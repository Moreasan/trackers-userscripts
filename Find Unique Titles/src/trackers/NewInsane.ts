import { parseImdbIdFromLink } from "../utils/utils";
import { tracker, Request, toGenerator, MetaData } from "./tracker";
import { addChild } from "common/dom";

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

async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
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

  yield* toGenerator(requests)
}

  name(): string {
    return "NewInsane";
  }

  async canUpload(request: Request) {
    return !request.imdbId;
  }

  insertTrackersSelect(select: HTMLElement): void {
    addChild(
      document.querySelector(".searchbuttons.actiontitle") as HTMLElement,
      select
    );
  }
}
