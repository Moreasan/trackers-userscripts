import { parseSize } from "../utils/utils";
import { Request, tracker } from "./tracker";
import tracker_tools from "common";

export default class Aither implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("aither.cc");
  }

  async getSearchRequest(): Promise<Array<Request>> {
    const requests: Array<Request> = [];
    document
      .querySelectorAll(".panelV2 tbody tr")
      .forEach((element: HTMLElement) => {
        let imdbId = element.querySelector("#imdb_id")?.textContent.trim();

        let size = parseSize(element.children[5]!.textContent!);
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
    return "Aither";
  }

  async canUpload(request: Request) {
    if (!request.imdbId) return true;
    const queryUrl =
      "https://aither.xyz/torrents?perPage=25&imdbId=" +
      request.imdbId +
      "&sortField=size";

    const result = await tracker_tools.http.fetchAndParseHtml(queryUrl);

    return result.textContent.includes(
      "There is no result in database for query"
    );
  }

  insertTrackersSelect(select: HTMLElement): void {
    const parent = document.querySelector(".panelV2 .panel__header");
    const div = document.createElement("div");
    select.style.width = "170px";
    div.classList.add("form__group");
    select.classList.add("form__select");
    tracker_tools.dom.addChild(div, select);
    tracker_tools.dom.insertAfter(div, parent.querySelector("h2"));
  }
}
