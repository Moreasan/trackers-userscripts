import { parseResolution, parseSize, parseYearAndTitle } from "../utils/utils";
import {
  Category,
  MetaData,
  Request,
  SearchResult,
  toGenerator,
  Torrent,
  AbstractTracker,
} from "./tracker";
import { addChild } from "common/dom";
import { fetchAndParseHtml } from "common/http";

function parseTorrent(element: HTMLElement): Torrent {
  const size = parseSize(element.childNodes[6].textContent);
  const title = element.querySelector(".torrentname a")!!.textContent!!.trim();
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
  let hrefValue = linkElement ? linkElement.getAttribute("href")!!.trim() : null;
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
  const torrentName = element.querySelector(".torrentname");
  const exclusiveLink = torrentName.querySelector(
    'a[href="torrents.php?tag_exclusive=yes"]'
  );
  return exclusiveLink != null;
};

export default class Pter extends AbstractTracker {
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
    const elements = Array.from(
      document.querySelectorAll("#torrenttable > tbody > tr")
    ).slice(1) as HTMLElement[];
    yield {
      total: elements.length,
    };
    for (let element of elements) {
      if (isExclusive(element)) {
        element.style.display = "none";
        continue;
      }
      const spanElement = element.querySelector("span[data-imdbid]");
      let imdbId = spanElement
        ? spanElement.getAttribute("data-imdbid")!!.trim()
        : null;
      if (imdbId) {
        imdbId = "tt" + imdbId;
      } else {
        imdbId = null;
      }

      const { title, year } = parseYearAndTitle(
        element.querySelector(".torrentname a")!!.textContent!!.trim()
      );

      const request: Request = {
        torrents: [parseTorrent(element)],
        dom: [element],
        imdbId,
        title,
        year,
        category: parseCategory(element),
      };
      yield request;
    }
  }

  name(): string {
    return "Pter";
  }

  async search(request: Request): Promise<SearchResult> {
    if (!request.imdbId) return SearchResult.NOT_CHECKED;
    const queryUrl = `https://pterclub.com/torrents.php?search=${request.imdbId}`;
    const result = await fetchAndParseHtml(queryUrl);
    return result.querySelector("#torrenttable") === null
      ? SearchResult.NOT_EXIST
      : SearchResult.EXIST;
  }

  insertTrackersSelect(select: HTMLElement): void {
    const targetLine = document.querySelector(
      ".searchbox > tbody:last-child table tr"
    );
    if (!targetLine) return
    const td = document.createElement("td");
    td.classList.add("embedded");
    td.appendChild(select);

    addChild(targetLine as HTMLElement, td);
  }
}
