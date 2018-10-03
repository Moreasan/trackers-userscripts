import {Request, tracker} from "./tracker";
import tracker_tools from "common";

export default class PTP implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("passthepopcorn.me");
  }

  async getSearchRequest(): Promise<Array<Request>> {
    return [];
  }

  name(): string {
    return "PTP";
  }

  async canUpload(request: Request) : Promise<boolean> {
    if (!request.imdbId) return true
    const query_url =
      "https://passthepopcorn.me/torrents.php?imdb=" + request.imdbId;
    const result = await tracker_tools.http.fetchAndParseHtml(query_url);
    return result.querySelector("#no_results_message") !== null;

  }

  insertTrackersSelect(select: HTMLSelectElement): void {
    let element = document.querySelector(".search-form__footer__buttons");
    if (!element) return
    tracker_tools.dom.insertBefore(
      select,
      element as HTMLElement
    );
  }
}
