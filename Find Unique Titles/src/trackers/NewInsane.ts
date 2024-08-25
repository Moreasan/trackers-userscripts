import { parseImdbIdFromLink } from "../utils/utils";
import {
  MetaData,
  Request,
  SearchResult,
  toGenerator,
  AbstractTracker,
} from "./tracker";
import { addChild } from "common/dom";

export default class NewInsane extends AbstractTracker {
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
          dom: [element as HTMLElement],
          imdbId,
          title: "",
        };
        requests.push(request);
      });

    yield* toGenerator(requests);
  }

  name(): string {
    return "NewInsane";
  }

  async search(request: Request): Promise<SearchResult> {
    return SearchResult.NOT_CHECKED;
  }

  insertTrackersSelect(select: HTMLElement): void {
    addChild(
      document.querySelector(".searchbuttons.actiontitle") as HTMLElement,
      select
    );
  }
}