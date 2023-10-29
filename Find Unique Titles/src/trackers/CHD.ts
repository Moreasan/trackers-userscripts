import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import { tracker, Request, MetaData } from "./tracker";
import { fetchAndParseHtml } from "common/http";
import { addChild } from "common/dom";

export default class CHD implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }
  
  canRun(url: string): boolean {
    return url.includes("ptchdbits.co");
  }
async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    let nodes =document.querySelectorAll('.torrents')[0].children[0].children;
    yield {
      total: nodes.length
    }
    let i = 1;
    for (const element of nodes) {
      if (!element.querySelector(".torrentname")) {
        continue;
      }
      const link: HTMLAnchorElement | null = element.querySelector(
        'a[href*="details.php?id"]'
      );
      if (!link) {
        continue;
      }
      let response = await fetchAndParseHtml(
        (link as HTMLAnchorElement).href
      );
      const imdbId = parseImdbIdFromLink(response as HTMLElement);

      const size = parseSize(element.querySelector('.rowfollow:nth-child(5)').innerText);
      console.log("size:",size);
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
      yield request
    }
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
    addChild(element as HTMLElement, select);
  }
}
