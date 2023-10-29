import { parseImdbIdFromLink } from "../utils/utils";
import { tracker, Request, toGenerator, MetaData } from "./tracker";
import { addChild, insertAfter } from "common/dom";

export default class CG implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return url.includes("iptorrents.com/movies");
  }

async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const requests: Array<Request> = [];
    document.querySelectorAll(".mBox table")?.forEach((element) => {
      const imdbId = parseImdbIdFromLink(element as HTMLElement);
      const request: Request = {
        torrents: [],
        dom: element.parentElement,
        imdbId,
        query: "",
      };
      requests.push(request);
    });

  yield* toGenerator(requests)
}

  name(): string {
    return "IPT";
  }

  async canUpload(request: Request) {
    return false;
  }

  insertTrackersSelect(select: HTMLElement): void {
    const element = document.createElement("p");
    addChild(element, select);
    insertAfter(
      element,
      document.querySelector('.mBox form input[name="q"]').closest("p")
    );
  }
}
