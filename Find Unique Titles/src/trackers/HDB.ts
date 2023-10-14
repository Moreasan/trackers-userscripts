import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import { tracker, Request, toGenerator, MetaData } from "./tracker";
import tracker_tools from "common";

export default class HDB implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("hdbits.org");
  }

async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const requests: Array<Request> = [];
    document
      .querySelectorAll("#torrent-list > tbody tr")
      ?.forEach((element: HTMLElement) => {
        const imdbId = parseImdbIdFromLink(element as HTMLElement);
        const size = parseSize(
          element.querySelector("td:nth-child(6)")?.textContent as string
        );

        const request: Request = {
          torrents: [
            {
              size,
              tags: [],
              dom: element,
            },
          ],
          dom: element as HTMLElement,
          imdbId,
          query: "",
        };
        requests.push(request);
      });

  yield* toGenerator(requests)
}

  name(): string {
    return "HDB";
  }

  async canUpload(request: Request) {
    if (!request.imdbId) return true;
    const queryUrl =
      "https://hdbits.org/browse.php?c3=1&c1=1&c2=1&tagsearchtype=or&imdb=" +
      request.imdbId +
      "&sort=size&h=8&d=DESC";

    const result = await tracker_tools.http.fetchAndParseHtml(queryUrl);

    return result
      .querySelector("#resultsarea")
      .textContent.includes("Nothing here!");
  }

  insertTrackersSelect(select: HTMLElement): void {
    document.querySelector("#moresearch3 > td:nth-child(2)").innerHTML +=
      "<br><br>Find unique for:<br>";
    tracker_tools.dom.addChild(
      document.querySelector("#moresearch3 > td:nth-child(2)") as HTMLElement,
      select
    );
  }
}
