import {
  parseImdbIdFromLink, parseResolution,
  parseSize,
  parseYearAndTitleFromReleaseName
} from "../utils/utils";
import { Category, MetaData, Request, SearchResult, tracker } from "./tracker";
import { addChild } from "common/dom";
import { fetchAndParseHtml } from "common/http";
import { search, SearchResult as SR } from "common/searcher";
import { TSeeds as TSeedsTracker } from "common/trackers";

const parseCategory = (element: Element): Category | undefined => {
  const icon = element.querySelector("i.torrent-icon");
  if (!icon) return undefined;
  if (icon.classList.contains("fa-female")) return Category.XXX;
  if (icon.classList.contains("fa-tv")) return Category.TV;
  if (icon.classList.contains("fa-film")) return Category.MOVIE;
  if (icon.classList.contains("fa-music")) return Category.MUSIC;
  if (icon.classList.contains("fa-basketball-ball")) return Category.SPORT;
  if (icon.classList.contains("fa-gamepad")) return Category.GAME;
  return undefined;
};

const parseYearAndTitle = (element: HTMLElement) => {
  const spans = element.querySelectorAll("h1.movie-heading span");
  if (spans.length == 1) {
    const releaseName = element
      .querySelector('ol li.active span[itemprop="title"]')!!
      .textContent!!.trim();
    return parseYearAndTitleFromReleaseName(releaseName);
  }
  const title = spans[0].textContent?.trim();
  let yearText = spans[1].textContent!!.trim();
  const year = parseInt(yearText.substring(1, yearText.length - 1), 10);
  return { title, year };
};
export default class TSeeds implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("torrentseeds.org");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    let torrentsSelector = "#torrent-list-table tbody tr";
    if (isCategoryPage()) {
      torrentsSelector = ".cat-torrents table tbody tr";
    }
    let nodes = Array.from(document.querySelectorAll(torrentsSelector));
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
          'a.view-torrent[href*="/torrents/"]'
        );
        let response = await fetchAndParseHtml(
          (link as HTMLAnchorElement).href
        );
        imdbId = parseImdbIdFromLink(response as HTMLElement);
        ({ title, year } = parseYearAndTitle(response));
      }
      let sizeText = element.querySelector(".torrent-listings-size span")
        ?.textContent as string;
      if (isCategoryPage()) {
        sizeText = element.children[7]?.textContent?.trim() as string;
      }
      const size = parseSize(sizeText);

      const request: Request = {
        torrents: [
          {
            size,
            tags: [],
            dom: element as HTMLElement,
            resolution: parseResolution(element.querySelector('a.view-torrent')!!.textContent!!)
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
    return "TSeeds";
  }

  async search(request: Request): Promise<SearchResult> {
    if (!request.imdbId) return SearchResult.NOT_CHECKED;
    const result = await search(TSeedsTracker, {
      movie_title: "",
      movie_imdb_id: request.imdbId,
    });
    if (result == SR.LOGGED_OUT) return SearchResult.NOT_LOGGED_IN;
    return result == SR.NOT_FOUND ? SearchResult.NOT_EXIST : SearchResult.EXIST;
  }

  insertTrackersSelect(select: HTMLElement): void {
    if (isCategoryPage()) {
      addChild(
        document.querySelector(
          ".table-responsive.cat-torrents .text-center"
        ) as HTMLElement,
        select
      );
    } else {
      const wrapper = document.createElement("div");
      wrapper.classList.add("form-group", "col-xs-3");
      wrapper.appendChild(select);
      addChild(
        document.querySelector("#torrent-list-search div.row") as HTMLElement,
        wrapper
      );
    }
  }
}
const isCategoryPage = () => {
  return document.location.toString().includes("/categories/");
};
