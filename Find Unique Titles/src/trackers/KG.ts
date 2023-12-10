import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import {
  Category,
  MetaData,
  Request,
  Resolution,
  SearchResult,
  Torrent,
  tracker,
} from "./tracker";
import { insertBefore } from "common/dom";
import { search, SearchResult as SR } from "common/searcher";
import { KG as KGTracker } from "common/trackers";

const parseCategory = (element: HTMLElement): Category => {
  const category = Category.MOVIE;
  let img = element.querySelectorAll("td img")[0];
  const imageSrc = img.getAttribute("src");
  if (imageSrc?.includes("40.jpg")) return Category.AUDIOBOOK;
  if (imageSrc?.includes("41.jpg")) return Category.BOOK;
  if (img.getAttribute("title")?.includes("Music")) return Category.MUSIC;
  return category;
};
const parseTitleAndYear = (element: Element) => {
  const year = parseInt(element.children[3].textContent!!.trim(), 10);
  const title = element.children[1].querySelector("a")!!.textContent!!.trim();
  return { title, year };
};
const parseTorrent = (element: HTMLElement): Array<Torrent> => {
  const torrents: Array<Torrent> = [];
  const size = parseSize(
    element
      .querySelector("td:nth-child(11)")
      ?.textContent?.replace(",", "") as string
  );
  let resolution = Resolution.SD;
  let format = undefined;
  if (element.querySelector('td img[src*="hdrip1080.png"]')) {
    resolution = Resolution.FHD;
  } else if (element.querySelector('td img[src*="hdrip720.png"]')) {
    resolution = Resolution.HD;
  } else if (element.querySelector('td img[src*="dvdr.png"]')) {
    format = "VOB IFO";
  } else if (element.querySelector('td img[src*="bluray.png"]')) {
    format = "m2ts";
  }
  torrents.push({
    size,
    format,
    tags: [],
    resolution,
    dom: element,
  });
  return torrents;
};

export default class KG implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("karagarga.in");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    let elements = Array.from(
      document.querySelectorAll("#browse > tbody tr")
    ).filter(
      (element) =>
        element.querySelector("td:nth-child(2) > div > span:nth-child(1)") !=
        null
    );
    yield {
      total: elements.length,
    };
    for (let element of elements) {
      let linksContainer = element.querySelector(
        "td:nth-child(2) > div > span:nth-child(1)"
      );
      const imdbId = parseImdbIdFromLink(linksContainer as HTMLElement);

      let torrents = parseTorrent(element as HTMLElement);
      const { year, title } = parseTitleAndYear(element);
      const request: Request = {
        torrents,
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
    return "KG";
  }

  async search(request: Request): Promise<SearchResult> {
    if (!request.imdbId) return SearchResult.NOT_CHECKED;
    const result = await search(KGTracker, {
      movie_title: "",
      movie_imdb_id: request.imdbId,
    });
    if (result == SR.LOGGED_OUT) return SearchResult.NOT_LOGGED_IN;
    return result == SR.NOT_FOUND ? SearchResult.NOT_EXIST : SearchResult.EXIST;
  }

  insertTrackersSelect(select: HTMLElement): void {
    insertBefore(select, document.getElementById("showdead") as HTMLElement);
  }
}