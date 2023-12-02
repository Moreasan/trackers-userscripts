import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import { Category, MetaData, Request, tracker } from "./tracker";
import { addChild } from "common/dom";
import { fetchAndParseHtml } from "common/http";
import { search, SearchResult } from "common/searcher";
import { MTV as MTVTracker, MTV_TV } from "common/trackers";

const parseCategory = (element: Element): Category | undefined => {
  const movieBanner = element.querySelector('div[title="hd.movie"]');
  if (movieBanner) return Category.MOVIE;
  return Category.TV;
};

const parseYearAndTitle = (
  htmlElement: HTMLElement
): { title: string | undefined; year: number | undefined } => {
  const pageTitle = htmlElement
    .querySelector("#content h2")
    ?.textContent?.trim();
  if (pageTitle) {
    const regex = /^(.*?)\s*\((\d{4})\)\s*-/;
    const match = pageTitle.match(regex);

    if (match) {
      const title = match[1].trim();
      const year = parseInt(match[2], 10);

      return { title, year };
    }
  }
  return { title: undefined, year: undefined };
};

export default class MTV implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("morethantv.me");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    let nodes = document.querySelectorAll("tr.torrent");
    yield {
      total: nodes.length,
    };
    for (const element of nodes) {
      const category = parseCategory(element);
      let imdbId = null;
      let title = undefined;
      let year = undefined;
      if (category == Category.MOVIE) {
        const link: HTMLAnchorElement | null = element.querySelector(
          'td a[href*="torrents.php?id="]'
        );
        let response = await fetchAndParseHtml(
          (link as HTMLAnchorElement).href
        );
        imdbId = parseImdbIdFromLink(response as HTMLElement);
        ({ title, year } = parseYearAndTitle(response));
      }
      let sizeText = element.children[4]?.textContent as string;
      const size = parseSize(sizeText);

      const request: Request = {
        torrents: [
          {
            size,
            tags: [],
            dom: element as HTMLElement,
          },
        ],
        dom: [element as HTMLElement],
        imdbId,
        title,
        year,
        category,
      };
      yield request;
    }
  }

  name(): string {
    return "MTV";
  }

  async canUpload(request: Request) {
    let result = SearchResult.NOT_FOUND;
    if (request.category == Category.MOVIE) {
      result = await search(MTVTracker, {
        movie_title: request.title,
      });
    } else {
      result = await search(MTV_TV, {
        movie_title: request.title,
      });
    }
    return result == SearchResult.NOT_FOUND;
  }

  insertTrackersSelect(select: HTMLElement): void {
    const wrapper = document.createElement("tr");
    const label = document.createElement("td");
    const selectTd = document.createElement("td");
    label.textContent = "Find Unique for:";
    label.classList.add("label");
    selectTd.appendChild(select);
    wrapper.appendChild(label);
    wrapper.appendChild(selectTd);
    addChild(
      document.querySelector("#search_box table.noborder tbody") as HTMLElement,
      wrapper
    );
  }
}
