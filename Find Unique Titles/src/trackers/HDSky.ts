import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import {
  Category,
  MetaData,
  MovieRequest,
  Request,
  SearchResult,
  AbstractTracker,
} from "./tracker";
import { addChild } from "common/dom";
import { fetchAndParseHtml } from "common/http";

export default class HDSky extends AbstractTracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return url.includes("hdsky.me");
  }

  async *getSearchRequest(): AsyncGenerator<
    MetaData | Request<any>,
    void,
    void
  > {
    let elements = Array.from(
      document.querySelectorAll(".torrents")[0].children[0].children
    ) as Array<HTMLElement>;
    for (const element of elements) {
      if (!element.querySelector(".torrentname")) {
        continue;
      }
      const imdbId = parseImdbIdFromLink(element.querySelector(".torrentname"));
      const size = parseSize(element.children[6]?.textContent as string);

      const request: MovieRequest = {
        torrents: [
          {
            size,
            tags: [],
            dom: element,
          },
        ],
        dom: [element],
        imdbId,
        title: "",
      };
      yield request;
    }
  }

  name(): string {
    return "HDSky";
  }

  async search(request: Request<any>): Promise<SearchResult> {
    if (request.category === Category.MOVIE) {
      const movieRequest = request as MovieRequest;
      const queryUrl =
        "https://hdsky.me/torrents.php?seeders=&medium13=1&medium1=1&incldead=0&spstate=0&inclbookmarked=0&search=" +
        movieRequest.imdbId +
        "&search_area=4&search_mode=0";

      const result = await fetchAndParseHtml(queryUrl);
      let notFound = result.querySelector(".torrentname") === null;
      if (notFound) {
        return SearchResult.NOT_EXIST;
      }
      return SearchResult.EXIST;
    }
  }

  insertTrackersSelect(select: HTMLElement): void {
    const element = document
      .querySelector(".searchbox")
      .children[2].querySelector("td td.rowfollow tr");
    addChild(element as HTMLElement, select);
  }
}
