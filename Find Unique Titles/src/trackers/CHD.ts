import {
  parseImdbIdFromLink,
  parseSize,
  parseTags,
  parseYearAndTitle,
} from "../utils/utils";
import {
  Category,
  MetaData,
  MovieRequest,
  Request,
  SearchResult,
  tracker,
} from "./tracker";
import { addChild } from "common/dom";
import { fetchAndParseHtml } from "common/http";

export default class CHD implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("ptchdbits.co") || url.includes("chddiy.xyz");
  }

  async *getSearchRequest(): AsyncGenerator<
    MetaData | Request<any>,
    void,
    void
  > {
    let nodes = Array.from(
      document.querySelectorAll(".torrents")[0].children[0].children
    ) as Array<HTMLElement>;
    yield {
      total: nodes.length,
    };
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
      let response = await fetchAndParseHtml((link as HTMLAnchorElement).href);
      const imdbId = parseImdbIdFromLink(response as HTMLElement);

      const size = parseSize(
        element.querySelector(".rowfollow:nth-child(5)")!!.textContent!!
      );
      let torrentName = element
        .querySelector(".torrentname a")
        ?.getAttribute("title");
      const { title, year } = parseYearAndTitle(torrentName);
      const request: MovieRequest = {
        torrents: [
          {
            size,
            tags: parseTags(torrentName),
            dom: element,
          },
        ],
        dom: [element],
        imdbId,
        title,
        year,
      };
      yield request;
    }
  }

  name(): string {
    return "CHD";
  }

  async search(request: Request<any>): Promise<SearchResult> {
    if (request.category === Category.MOVIE) {
      const movieRequest = request as MovieRequest;
      const queryUrl =
        "https://ptchdbits.co/torrents.php?medium1=1&incldead=0&spstate=0&inclbookmarked=0&search=" +
        movieRequest.imdbId +
        "&search_area=4&search_mode=0";

      const result = await fetchAndParseHtml(queryUrl);
      let notFound = result.querySelector(".torrentname") === null;
      if (notFound) {
        return SearchResult.NOT_EXIST;
      }
      return SearchResult.EXIST;
    }

    return SearchResult.NOT_CHECKED;
  }

  insertTrackersSelect(select: HTMLElement): void {
    const element = document
      .querySelector(".searchbox")!!
      .children[2].querySelector("td td.rowfollow tr");
    addChild(element as HTMLElement, select);
  }
}
