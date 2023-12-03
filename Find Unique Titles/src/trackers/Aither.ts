import { parseSize } from "../utils/utils";
import { MetaData, Request, SearchResult, toGenerator, tracker } from "./tracker";
import { addChild, insertAfter } from "common/dom";
import { fetchAndParseHtml } from "common/http";


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

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const requests: Array<Request> = [];
    document
      .querySelectorAll(".panelV2 tbody tr")
      .forEach((element: HTMLElement) => {
        let imdbId = element.querySelector("#imdb_id")!!.textContent!!.trim();

        let size = parseSize(element.children[5]!.textContent!);
        const request: Request = {
          torrents: [
            {
              size,
              tags: [],
              dom: element,
            },
          ],
          dom: [element],
          imdbId,
          title: "",
        };
        requests.push(request);
      });

    yield* toGenerator(requests);
  }

  name(): string {
    return "Aither";
  }

  async search(request: Request): Promise<SearchResult> {
    if (!request.imdbId) return SearchResult.NOT_CHECKED;
    const queryUrl =
      "https://aither.xyz/torrents?perPage=25&imdbId=" +
      request.imdbId +
      "&sortField=size";

    const result = await fetchAndParseHtml(queryUrl);

    return result.textContent.includes(
      "There is no result in database for query"
    )
      ? SearchResult.NOT_EXIST
      : SearchResult.EXIST;
  }

  insertTrackersSelect(select: HTMLElement): void {
    const parent = document.querySelector(".panelV2 .panel__header");
    const div = document.createElement("div");
    select.style.width = "170px";
    div.classList.add("form__group");
    select.classList.add("form__select");
    addChild(div, select);
    insertAfter(div, parent.querySelector("h2"));
  }
}