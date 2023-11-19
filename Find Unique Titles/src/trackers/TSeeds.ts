import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import { Category, MetaData, Request, tracker } from "./tracker";
import { addChild } from "common/dom";
import { fetchAndParseHtml } from "common/http";
import { search, SearchResult } from "common/searcher";
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
      torrentsSelector = '.cat-torrents table tbody tr'
    }
    let nodes = document.querySelectorAll(torrentsSelector);
    yield {
      total: nodes.length,
    };
    for (const element of nodes) {
      const category = parseCategory(element);
      let imdbId = null;
      if (category == Category.MOVIE) {
        const link: HTMLAnchorElement | null = element.querySelector(
          'a.view-torrent[href*="/torrents/"]'
        );
        let response = await fetchAndParseHtml(
          (link as HTMLAnchorElement).href
        );
        imdbId = parseImdbIdFromLink(response as HTMLElement);
      }
      let sizeText = element.querySelector(".torrent-listings-size span")
        ?.textContent as string;
      if (isCategoryPage()) {
        sizeText = element.children[7]?.textContent?.trim() as string
      }
      const size = parseSize(
        sizeText
      );

      const request: Request = {
        torrents: [
          {
            size,
            tags: [],
            dom: element as HTMLElement,
          },
        ],
        dom: element as HTMLElement,
        imdbId,
        query: "",
        category,
      };
      yield request;
    }
  }

  name(): string {
    return "TSeeds";
  }

  async canUpload(request: Request) {
    if (!request.imdbId) return true;
    const result = await search(TSeedsTracker, {
      movie_title: "",
      movie_imdb_id: request.imdbId,
    });
    return result == SearchResult.NOT_FOUND;
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
