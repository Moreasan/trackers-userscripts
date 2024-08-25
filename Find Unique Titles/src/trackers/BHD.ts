import {
  parseImdbIdFromLink,
  parseResolution,
  parseSize,
  parseTags,
} from "../utils/utils";
import {
  Category,
  MetaData,
  Request,
  SearchResult,
  toGenerator,
  Torrent,
  AbstractTracker,
} from "./tracker";
import { insertBefore } from "common/dom";
import { fetchAndParseHtml } from "common/http";

const parseTorrents = (element: HTMLElement): Array<Torrent> => {
  const torrents: Torrent[] = [];
  element
    .querySelectorAll('tr[id^="resulttorrent"]')
    .forEach((torrentElement) => {
      const data = torrentElement.children[0]!!.textContent!!.trim().split("/");
      const size = parseSize(torrentElement.children[4]!!.textContent!!.trim());
      const tags = parseTags(torrentElement.textContent);
      const torrent: Torrent = {
        container: data[0].trim(),
        format: data[1].trim(),
        resolution: parseResolution(data[3].trim()),
        tags: tags,
        size,
        dom: torrentElement as HTMLElement,
      };
      torrents.push(torrent);
    });
  return torrents;
};

const parseCategory = (element: Element) => {
  const html = element.children[0].innerHTML;
  if (html.includes("categories/tv")) return Category.TV;
  else if (html.includes("categories/movies")) return Category.MOVIE;
  return undefined;
};

const parseTorrentsFromTorrentsPage = (): Array<Request> => {
  const requests: Array<Request<any>> = [];
  Array.from(document.querySelectorAll('tr[id^="torrentposter"]')).forEach(
    (element) => {
      let imdbId = null;
      let libraryId = element.getAttribute("library");
      if (libraryId) {
        let imdbElement = document.querySelector(`#librarydiv${libraryId}`);
        if (imdbElement) {
          imdbId = parseImdbIdFromLink(imdbElement as HTMLElement);
        }
      }
      const tags = [];
      const torrentName =
        element.children[1].querySelector('a[id^="torrent"]')!!.textContent!!;
      if (torrentName.toUpperCase().includes("REMUX")) {
        tags.push("Remux");
      }
      const torrent: Torrent = {
        dom: element,
        size: parseSize(element.children[5].textContent),
        tags: tags,
        resolution: parseResolution(torrentName),
      };
      const torrents = [torrent];

      const request: Request = {
        torrents: torrents,
        dom: [element],
        imdbId,
        title: "",
        category: parseCategory(element),
      };
      requests.push(request);
    }
  );
  return requests;
};

const parseTorrentsFromLibraryPage = (): Array<Request> => {
  const requests: Array<Request> = [];
  document.querySelectorAll(".bhd-meta-box").forEach((element) => {
    let imdbId = parseImdbIdFromLink(element as HTMLElement);

    const request: Request = {
      torrents: parseTorrents(element as HTMLElement),
      dom: [element as HTMLElement],
      imdbId,
      title: "",
    };
    requests.push(request);
  });
  return requests;
};

const isLibraryPage = () => {
  return window.location.href.includes("/library");
};
const isTorrentsPage = () => {
  return window.location.href.includes("/torrents");
};

export default class BHD extends AbstractTracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("beyond-hd.me");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    let requests: Array<Request> = [];
    if (isLibraryPage()) {
      requests = parseTorrentsFromLibraryPage();
    } else if (isTorrentsPage()) {
      requests = parseTorrentsFromTorrentsPage();
    }
    yield* toGenerator(requests);
  }

  name(): string {
    return "BHD";
  }

  async search(request: Request): Promise<SearchResult> {
    if (!request.imdbId) return SearchResult.NOT_CHECKED;
    const queryUrl =
      "https://beyond-hd.me/library/movies?activity=&q=" + request.imdbId;

    const result = await fetchAndParseHtml(queryUrl);

    return result.querySelectorAll(".bhd-meta-box").length === 0
      ? SearchResult.NOT_EXIST
      : SearchResult.EXIST;
  }

  insertTrackersSelect(select: HTMLElement): void {
    select.classList.add("beta-form-main");
    select.style.width = "170px";
    insertBefore(
      select,
      document.querySelector(".button-center") as HTMLElement
    );
  }
}
