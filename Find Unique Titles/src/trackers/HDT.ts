import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import {
  MetaData,
  Request,
  SearchResult,
  toGenerator,
  AbstractTracker,
} from "./tracker";
import { addChild } from "common/dom";

export default class HDT extends AbstractTracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return url.includes("hd-torrents.org");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const requests: Array<Request> = [];
    document
      .querySelectorAll(
        'table.mainblockcontenttt tr a[href^="details.php?id="]'
      )
      ?.forEach((element: HTMLElement) => {
        const imdbId = parseImdbIdFromLink(element.closest("td"));
        let line = element.closest("tr");
        const size = parseSize(line.children[7]?.textContent as string);

        const request: Request = {
          torrents: [
            {
              size,
              tags: [],
              dom: element,
            },
          ],
          dom: [line],
          imdbId,
          title: "",
        };
        requests.push(request);
      });

    yield* toGenerator(requests);
  }

  name(): string {
    return "HDT";
  }

  async search(request: Request): Promise<SearchResult> {
    return SearchResult.NOT_CHECKED;
  }

  insertTrackersSelect(select: HTMLElement): void {
    const element = document.querySelectorAll(".mainblockcontentsearch tr")[2];
    addChild(element as HTMLElement, select);
  }
}