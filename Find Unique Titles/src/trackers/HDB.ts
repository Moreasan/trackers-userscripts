import {
  parseImdbId,
  parseResolution,
  parseSize,
  parseTags,
  parseYearAndTitle,
} from "../utils/utils";
import {
  Category,
  MetaData,
  Request,
  SearchResult,
  Torrent,
  tracker,
} from "./tracker";
import { addChild } from "common/dom";
import { logger } from "common/logger";
import { search, SearchResult as SR } from "common/searcher";
import { HDb as HDBTracker } from "common/trackers";

const isExclusive = (element: HTMLElement) => {
  const exclusiveLink = element.querySelector(
    'a[href="/browse.php?exclusive=1"]'
  );
  return exclusiveLink != null;
};

function parseTorrent(element: HTMLElement): Torrent {
  const size = parseSize(
    element.querySelector("td:nth-child(6)")?.textContent as string
  );
  const title = element
    .querySelector(".browse_td_name_cell a")
    ?.textContent?.trim();
  const resolution = parseResolution(title);
  const tags = parseTags(title);

  return {
    size,
    tags,
    dom: element,
    resolution,
  };
}

function parseCategory(element: HTMLElement) {
  const category = element
    .querySelector(".catcell a")
    ?.getAttribute("href")
    ?.replace("?cat=", "");
  switch (category) {
    case "1":
      return Category.MOVIE;
    case "2":
      return Category.TV;
    case "3":
      return Category.DOCUMENTARY;
    case "4":
      return Category.MUSIC;
    case "5":
      return Category.SPORT;
    case "6":
      return Category.MUSIC;
    case "7":
      return Category.XXX;
  }
}

export default class HDB implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("hdbits.org");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const elements = Array.from(
      document.querySelectorAll("#torrent-list > tbody tr")
    ) as Array<HTMLElement>;
    yield {
      total: elements.length,
    };
    for (let element of elements) {
      try {
        if (isExclusive(element)) {
          element.style.display = "none";
          yield null;
          continue;
        }
        const imdbId = parseImdbId(
          element
            .querySelector("a[data-imdb-link]")
            ?.getAttribute("data-imdb-link")
        );

        const { title, year } = parseYearAndTitle(
          element.children[2].querySelector("a")?.textContent
        );

        yield {
          torrents: [parseTorrent(element)],
          dom: [element as HTMLElement],
          imdbId,
          title,
          year,
          category: parseCategory(element),
        };
      } catch (e) {
        console.trace(e);
        logger.info(
          "[{0}] Error occurred while parsing torrent: " + e,
          this.name()
        );
        yield {
          torrents: [],
          dom: [element as HTMLElement],
        };
      }
    }
  }

  name(): string {
    return "HDB";
  }

  async search(request: Request): Promise<SearchResult> {
    if (!request.imdbId) return SearchResult.NOT_CHECKED;
    const result = await search(HDBTracker, {
      movie_title: "",
      movie_imdb_id: request.imdbId,
    });
    if (result == SR.LOGGED_OUT) return SearchResult.NOT_LOGGED_IN;
    return result == SR.NOT_FOUND ? SearchResult.NOT_EXIST : SearchResult.EXIST;
  }

  insertTrackersSelect(select: HTMLElement): void {
    const targetElement = document.querySelector(
      "#moresearch3 > td:nth-child(2)"
    );
    if (targetElement) {
      targetElement.innerHTML += "<br><br>Find unique for:<br>";
      addChild(targetElement as HTMLElement, select);
    } else {
      logger.info("[{0}] Can add search select", this.name());
    }
  }
}
