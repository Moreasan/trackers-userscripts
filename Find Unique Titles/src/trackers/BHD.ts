import { parseImdbIdFromLink, parseResolution, parseSize } from "../utils/utils";
import { Category, MetaData, Request, toGenerator, Torrent, tracker } from "./tracker";
import { insertBefore } from "common/dom";
import { fetchAndParseHtml } from "common/http";

const parseTorrents = (element: HTMLElement): Array<Torrent> => {
  const torrents: Torrent[] = [];
  element.querySelectorAll('tr[id^="resulttorrent"]').forEach((torrentElement) => {
    const data = torrentElement.children[0].textContent.trim().split("/");
    const size = parseSize(torrentElement.children[4].textContent.trim());
    const tags = [];
    if (torrentElement.textContent.includes("Remux")) {
      tags.push("Remux");
    }
    const torrent: Torrent = {
      container: data[0].trim(),
      format: data[1].trim(),
      resolution: data[3].trim(),
      tags: tags,
      size,
      dom: torrentElement as HTMLElement,
    };
    torrents.push(torrent);
  });
  return torrents;
};

const parseCategory = (element: Element) => {
  const html = element.children[0].innerHTML
  if (html.includes("categories/tv")) return Category.TV
  else if (html.includes("categories/movies")) return Category.MOVIE
  return undefined;
}

const parseTorrentsFromTorrentsPage = (): Array<Request> => {
  const requests = [];
  document.querySelectorAll('tr[id^="torrentposter"]').forEach((element: HTMLElement) => {
    let imdbId = null;
    let libraryId = element.getAttribute("library");
    if (libraryId) {
      let imdbElement = document.querySelector(`#librarydiv${libraryId}`);
      if (imdbElement) {
        imdbId = parseImdbIdFromLink(imdbElement as HTMLElement)
      }
    }
    const tags = [];
    const torrentName = element.children[1].querySelector('a[id^="torrent"]').textContent
    if (torrentName.toUpperCase().includes("REMUX")) {
      tags.push("Remux");
    }
    const torrent: Torrent = {
      dom: element,
      size: parseSize(element.children[5].textContent),
      tags: tags,
      resolution: parseResolution(torrentName)

    }
    const torrents = [torrent]

    const request: Request = {
      torrents: torrents,
      dom: element,
      imdbId,
      title: "",
      category: parseCategory(element)
    };
    requests.push(request);
  });
  return requests;
};

const parseTorrentsFromMoviesPage = (): Array<Request> => {
  const requests = [];
  document.querySelectorAll(".bhd-meta-box").forEach((element) => {
    let imdbId = parseImdbIdFromLink(element as HTMLElement);

    const request: Request = {
      torrents: parseTorrents(element as HTMLElement),
      dom: element as HTMLElement,
      imdbId,
      title: "",
    };
    requests.push(request);
  });
  return requests;
};

const isMoviesPage = () => {
  return window.location.href.includes("/movies");
};
const isTorrentsPage = () => {
  return window.location.href.includes("/torrents");
};

export default class BHD implements tracker {
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
    if (isMoviesPage()) {
      requests = parseTorrentsFromMoviesPage();
    } else if (isTorrentsPage()) {
      requests = parseTorrentsFromTorrentsPage();
    }
    yield* toGenerator(requests);
  }

  name(): string {
    return "BHD";
  }

  async canUpload(request: Request) {
    if (!request.imdbId) return true;
    const queryUrl =
      "https://beyond-hd.me/library/movies?activity=&q=" + request.imdbId;

    const result = await fetchAndParseHtml(queryUrl);

    return result.querySelectorAll(".bhd-meta-box").length === 0;
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
