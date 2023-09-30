import { parseSize } from "../utils/utils";
import { Request, tracker } from "./tracker";
import tracker_tools from "common";

export default class BLU implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("blutopia.xyz") || url.includes("blutopia.cc");
  }

  async getSearchRequest(): Promise<Array<Request>> {
    const requests: Array<Request> = [];
    document
      .querySelectorAll(".torrent-search--list__results tbody tr")
      .forEach((element: HTMLElement) => {
        let imdbId = "tt" + element.getAttribute("data-imdb-id");

        let size = parseSize(
          element.querySelector(".torrent-search--list__size")!.textContent!
        );
        const request: Request = {
          torrents: [
            {
              size,
              tags: [],
              dom: element,
            },
          ],
          dom: element,
          imdbId,
          query: "",
        };
        requests.push(request);
      });

    return requests;
  }

  name(): string {
    return "BLU";
  }

  async canUpload(request: Request) {
    if (!request.imdbId) return true;
    const queryUrl =
      "https://blutopia.xyz/torrents?perPage=25&imdbId=" +
      request.imdbId +
      "&sortField=size";

    const result = await tracker_tools.http.fetchAndParseHtml(queryUrl);

    return result.querySelector(".torrent-listings-no-result") !== null;
  }

  insertTrackersSelect(select: HTMLElement): void {
    select.classList.add("form__select");
    tracker_tools.dom.addChild(
      document.querySelectorAll(".panel__actions")[1] as HTMLElement,
      select
    );
  }
}
