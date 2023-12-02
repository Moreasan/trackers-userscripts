import { parseResolution, parseSize } from "../utils/utils";
import {
  Category,
  MetaData,
  Request,
  toGenerator,
  Torrent,
  tracker,
} from "./tracker";
import { addChild } from "common/dom";
import { fetchAndParseHtml } from "common/http";

function parseTorrent(element: HTMLElement): Torrent {
  const size = parseSize(element.childNodes[6].textContent);
  const title = element.querySelector(".torrentname a").textContent.trim();
  let resolution = parseResolution(title);

  return {
    size,
    tags: [],
    dom: element,
    resolution,
  };
}

function parseCategory(element: HTMLElement) {
  let linkElement = element.querySelector('a[href^="?cat"]');
  let hrefValue = linkElement ? linkElement.getAttribute("href").trim() : null;
  if (hrefValue) {
    hrefValue = hrefValue.replace("?cat=", "");
  }
  switch (hrefValue) {
    case "401":
      return Category.MOVIE;
    case "402":
      return Category.DOCUMENTARY;
    case "403":
      return Category.ANIME;
    case "404":
      return Category.TV;
    case "405":
      return Category.TV;
    case "406":
      return Category.MUSIC;
    case "407":
      return Category.SPORT;
    case "408":
      return Category.BOOK;
    case "409":
      return Category.GAME;
    case "411": {
      const source = element.children[0].children[1]
        .querySelector("img")
        .getAttribute("title")
        .toLocaleUpperCase();
      switch (source) {
        case "PDF":
        case "MOBI":
        case "EPUB":
          return Category.BOOK;
      }
      return null;
    }
    case "413":
      return Category.MV;
    case "418":
      return Category.LIVE_PERFORMANCE;
  }
}

const isExclusive = (element: HTMLElement) => {
  const torrentName = element.querySelector('.torrentname')
  const exclusiveLink = torrentName.querySelector('a[href="torrents.php?tag_exclusive=yes"]')
  return exclusiveLink != null;
}

export default class Pter implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("pterclub.com");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const requests: Array<Request> = [];
    const elements = document.querySelectorAll("#torrenttable > tbody > tr");
    Array.from(elements)
      .slice(1)
      .forEach((element: HTMLElement) => {
        if (isExclusive(element)) {
          element.style.display = 'none'
          return
        }
        const spanElement = element.querySelector("span[data-imdbid]");
        let imdbId = spanElement
          ? spanElement.getAttribute("data-imdbid").trim()
          : null;
        if (imdbId) {
          imdbId = "tt" + imdbId;
        } else {
          imdbId = null
        }

        const request: Request = {
          torrents: [parseTorrent(element)],
          dom: [element],
          imdbId,
          title: "",
          category: parseCategory(element),
        };
        requests.push(request);
      });

    yield* toGenerator(requests);
  }

  name(): string {
    return "Pter";
  }

  async canUpload(request: Request) {
    if (!request.imdbId) return true;
    const queryUrl = `https://pterclub.com/torrents.php?search=${request.imdbId}`;
    const result = await fetchAndParseHtml(queryUrl);
    return result.querySelector("#torrenttable") === null;
  }

  insertTrackersSelect(select: HTMLElement): void {
    const targetLine = document.querySelector(
      ".searchbox > tbody:last-child table tr"
    );
    const td = document.createElement("td");
    td.classList.add("embedded");
    td.appendChild(select);

    addChild(targetLine, td);
  }
}
