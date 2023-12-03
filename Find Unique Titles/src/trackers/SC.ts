import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import {
  Category,
  MetaData,
  Request,
  SearchResult,
  Torrent,
  tracker,
} from "./tracker";
import { addChild } from "common/dom";
import { fetchAndParseHtml } from "common/http";

function parseTorrent(element: HTMLElement): Torrent {
  let infos = element
    .querySelector(".torrent_info .activity_info")!!
    .querySelectorAll("div");
  let size = parseSize(infos[1].textContent as string);
  let resolution: string | undefined = infos[0].textContent.trim();
  if (resolution == "CD" || resolution == "WEB") {
    resolution = undefined;
  }
  let format = undefined;
  if (resolution === "DVD-R") {
    resolution = "SD";
    format = "VOB IFO";
  }
  return {
    size,
    tags: [],
    dom: element,
    resolution,
    format,
  };
}

function parseCategory(element: HTMLElement) {
  let category = Category.MOVIE;
  let infos = element
    .querySelector(".torrent_info .activity_info")!!
    .querySelectorAll("div");
  let info = infos[0].textContent;
  if (info == "CD" || info === "WEB") {
    category = Category.MUSIC;
  } else if (
    element.querySelector(".torrent_tags")!!.textContent!!.includes("ebook")
  ) {
    category = Category.BOOK;
  }
  return category;
}

const parseYearTitle = (element: Element) => {
  const title = element.querySelector(".torrent_title b")!!.textContent!!;
  const year = parseInt(
    element.querySelector(".torrent_year")!!.textContent!!.split("|")[0].trim(),
    10
  );
  return { title, year };
};
export default class SC implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("secret-cinema.pw") && !url.includes("torrents.php?id");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const elements = Array.from(
      document.querySelectorAll(".torrent_card")
    ).filter((element) => element.querySelector(".torrent_tags") != null);
    yield {
      total: elements.length,
    };
    for (let element of elements) {
      let links_container: HTMLElement =
        element.querySelector(".torrent_tags")!!;

      const imdbId = parseImdbIdFromLink(links_container);
      const { title, year } = parseYearTitle(element);

      const request: Request = {
        torrents: [parseTorrent(element as HTMLElement)],
        dom: [element as HTMLElement],
        imdbId,
        title,
        year,
        category: parseCategory(element as HTMLElement),
      };
      yield request;
    }
  }

  name(): string {
    return "SC";
  }

  async search(request: Request): Promise<SearchResult> {
    if (!request.imdbId) return SearchResult.NOT_CHECKED;
    const queryUrl = `https://secret-cinema.pw/torrents.php?action=advanced&searchsubmit=1&cataloguenumber=${request.imdbId}&order_by=time&order_way=desc&tags_type=0`;
    const result = await fetchAndParseHtml(queryUrl);
    return result.querySelector(".torrent_card_container") === null
      ? SearchResult.NOT_EXIST
      : SearchResult.EXIST;
  }

  insertTrackersSelect(select: HTMLElement): void {
    addChild(document.querySelector("#ft_container p") as HTMLElement, select);
  }
}