import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import { tracker, Request, toGenerator, MetaData } from "./tracker";
import { addChild } from "common/dom";

export default class MTeam implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return (
      url.includes("https://kp.m-team.cc") &&
      (url.includes("torrents.php") || url.includes("movie.php"))
    );
  }

async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const requests: Array<Request> = [];
    for (const element of document.querySelectorAll('.torrents')[0].children[0].children) {
      if (!element.querySelector(".torrentname")) {
        continue;
      }
      const imdbId = parseImdbIdFromLink(element.querySelector(".torrentname"));
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

  yield* toGenerator(requests)
}

  name(): string {
    return "M-Team";
  }

  async canUpload(request: Request) {
    return false;
  }

  insertTrackersSelect(select: HTMLElement): void {
    const element = document
      .querySelector(".searchbox")
      .children[2].querySelector("td td.rowfollow tr");
    addChild(element as HTMLElement, select);
  }
}
