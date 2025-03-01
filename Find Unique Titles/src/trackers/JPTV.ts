import {
  parseCodec,
  parseImdbIdFromLink, parseReleaseGroup, parseResolution,
  parseSize, parseTags,
  parseTmdbIdFromLink,
  parseYearAndTitle
} from "../utils/utils";
import {
  MetaData,
  Request,
  SearchResult,
  toGenerator,
  AbstractTracker,
} from "./tracker";
import { addChild } from "common/dom";
import { fetchAndParseHtml } from "common/http";
import { logger } from "common/logger";
import { getImdbIdFromTmdbID } from "common/searcher";
import * as url from "node:url";

export default class JPTV extends AbstractTracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return url.includes("jptv.club");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const requests: Array<Request> = [];
    let nodes = Array.from(document.querySelectorAll(".view-torrent"));
    yield {
      total: nodes.length,
    };
    for (const element of nodes) {
      let response = await fetchAndParseHtml(
        (element as HTMLAnchorElement).href
      );
      let imdbId = parseImdbIdFromLink(response as HTMLElement);
      if (!imdbId) {
        const tmdb = parseTmdbIdFromLink(response as HTMLElement);
        if (tmdb) {
          logger.debug(
            "{0} Will try find ImdbId from TmdbId {1}",
            this.name(),
            tmdb
          );
          imdbId = await getImdbIdFromTmdbID(tmdb);
        }
      }
      const size = parseSize(
        element?.parentElement?.parentElement?.children[7]?.textContent?.trim() as string
      );
      let torrentTitle = element.textContent!!.trim();
      const { title, year } = parseYearAndTitle(
        torrentTitle
      );
      const request: Request = {
        torrents: [
          {
            size,
            tags: parseTags(torrentTitle),
            resolution: parseResolution(torrentTitle),
            container: parseCodec(torrentTitle),
            releaseGroup: parseReleaseGroup(torrentTitle),
            dom: element,
          },
        ],
        dom: [element as HTMLElement],
        imdbId,
        title,
        year,
      };
      yield request;
    }
  }

  name(): string {
    return "JPTV";
  }

  async search(request: Request): Promise<SearchResult> {
    return SearchResult.NOT_CHECKED;
  }

  insertTrackersSelect(select: HTMLElement): void {
    if (window.location.toString().indexOf("/filter") > -1) {
      addChild(
        document.querySelector("ul.pagination") as HTMLUListElement,
        select
      );
    } else {
      addChild(
        document.querySelector(".form-torrent-search") as HTMLElement,
        select
      );
    }
  }
}
