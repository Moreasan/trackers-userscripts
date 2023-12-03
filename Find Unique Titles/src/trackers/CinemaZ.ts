import { parseImdbIdFromLink } from "../utils/utils";
import {
  tracker,
  Request,
  toGenerator,
  MetaData,
  SearchResult,
} from "./tracker";
import { addChild } from "common/dom";
import { fetchAndParseHtml } from "common/http";

export default class CinemaZ implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("cinemaz.to");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const requests: Array<Request> = [];
    document
      .querySelectorAll("#content-area > div.block > .row")
      ?.forEach((element: HTMLElement) => {
        const imdbId = parseImdbIdFromLink(element);

        const request: Request = {
          torrents: [],
          dom: [element],
          imdbId,
          title: "",
        };
        requests.push(request);
      });

    yield* toGenerator(requests);
  }

  name(): string {
    return "CinemaZ";
  }

  async search(request: Request): Promise<SearchResult> {
    if (!request.imdbId) return SearchResult.NOT_CHECKED;
    const queryUrl = "https://cinemaz.to/movies?search=&imdb=" + request.imdbId;

    const result = await fetchAndParseHtml(queryUrl);

    return result.textContent!!.includes("No Movie found!")
      ? SearchResult.NOT_EXIST
      : SearchResult.EXIST;
  }

  insertTrackersSelect(select: HTMLElement): void {
    addChild(
      document.querySelector("#content-area > div.well.well-sm") as HTMLElement,
      select
    );
  }
}
