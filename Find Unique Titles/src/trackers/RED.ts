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
    if (!musicRequest.artists || !musicRequest.titles || !musicRequest.year)
      return SearchResult.NOT_CHECKED;
    for (let artist of musicRequest.artists) {
      for (let title of musicRequest.titles) {
        const queryUrl = `https://redacted.ch/torrents.php?artistname=${encodeURIComponent(
          artist
        )}&groupname=${encodeURIComponent(title)}&year=${
          musicRequest.year
        }&order_by=time&order_way=desc&group_results=1&filter_cat%5B1%5D=1&action=advanced&searchsubmit=1`;
        const result = await fetchAndParseHtml(queryUrl);
        if (
          !result.textContent?.includes("Your search did not match anything.")
        )
          return SearchResult.EXIST;
      }
    }
    return SearchResult.NOT_EXIST;

    return SearchResult.EXIST;
  }

  insertTrackersSelect(select: HTMLElement): void {}
}
