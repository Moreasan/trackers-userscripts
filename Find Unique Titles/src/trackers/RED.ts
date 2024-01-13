import {
  Category,
  MetaData,
  MusicReleaseType,
  MusicRequest,
  Request,
  SearchResult,
  tracker,
} from "./tracker";
import { fetchAndParseHtml } from "common/http";
import { logger } from "common/logger";

const parseTorrents = (html: HTMLElement) => {
  const groups = Array.from(html.querySelectorAll(".group_info strong"));
  const torrents = [];
  for (let group of groups) {
    const yearAndTitle = group?.textContent?.split(" - ");
    if (yearAndTitle) {
      torrents.push({
        year: parseInt(yearAndTitle[0], 10),
        title: yearAndTitle[1],
      });
    }
  }
  return torrents;
};

function titlesAreEqual(first: string, second: string) {
  first = first.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  second = second.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return first.toLowerCase() == second.toLowerCase();
}

export default class RED implements tracker {
  canBeUsedAsSource(): boolean {
    return false;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("redacted.ch");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    yield {
      total: 0,
    };
  }

  name(): string {
    return "RED";
  }

  async search(request: Request): Promise<SearchResult> {
    if (request.category != Category.MUSIC) return SearchResult.NOT_ALLOWED;
    const musicRequest = request as MusicRequest;
    if (
      musicRequest.type != MusicReleaseType.ALBUM &&
      musicRequest.type != MusicReleaseType.SINGLE
    )
      return SearchResult.NOT_ALLOWED;
    if (!musicRequest.artists || !musicRequest.titles || !musicRequest.year) {
      logger.debug(
        "[{0}] Not enough data to check request: {1}",
        this.name(),
        request
      );
      return SearchResult.NOT_CHECKED;
    }
    for (let artist of musicRequest.artists) {
      for (let title of musicRequest.titles) {
        if (artist === "VA") {
          artist = "";
        }
        if (artist) {
          const queryUrl = `https://redacted.ch/artist.php?artistname=${encodeURIComponent(
            artist
          )}`;
          const result = await fetchAndParseHtml(queryUrl);
          if (
            result.textContent?.includes(
              "Your search did not match anything."
            ) ||
            result.querySelector("#search_terms")
          ) {
            return SearchResult.NOT_EXIST;
          }
          const torrents = parseTorrents(result);
          logger.debug(
            "[{0}] Parsed following torrents for artist: {1}: {2}",
            this.name(),
            artist,
            torrents
          );
          for (let torrent of torrents) {
            if (
              torrent.year == request.year &&
              titlesAreEqual(title, torrent.title)
            ) {
              return SearchResult.EXIST;
            }
          }
        }
      }
    }
    return SearchResult.NOT_EXIST;
  }

  insertTrackersSelect(select: HTMLElement): void {}
}
