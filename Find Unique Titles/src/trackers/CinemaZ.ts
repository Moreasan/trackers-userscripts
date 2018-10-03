import tracker_tools from "common";
import {parseImdbIdFromLink} from "../utils/utils";
import {tracker, Request} from "./tracker";

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

  async getSearchRequest(): Promise<Array<Request>> {
    const requests: Array<Request> = [];
    document.querySelectorAll('#content-area > div.block > .row')
      ?.forEach((element) => {

        const imdbId = parseImdbIdFromLink(element as HTMLElement)

        const request: Request = {
          data: {
            format: null,
            resolution: null,
            size: null,
            tags: null,
          },
          dom: element as HTMLElement,
          imdbId,
          query: "",
        };
        requests.push(request);
      });

    return requests;
  }

  name(): string {
    return "CinemaZ";
  }

  async canUpload(request: Request) {
    if (!request.imdbId) return true
    const queryUrl = 'https://cinemaz.to/movies?search=&imdb=' + request.imdbId

    const result = await tracker_tools.http.fetchAndParseHtml(queryUrl)

    return result.textContent?.includes("No Movie found!");



  }

  insertTrackersSelect(select: HTMLElement): void {
    tracker_tools.dom.addChild(document.querySelector('#content-area > div.well.well-sm') as HTMLElement, select)
  }
}
