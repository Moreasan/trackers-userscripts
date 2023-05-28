import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import { tracker, Request } from "./tracker";
import tracker_tools from "common";

export default class CG implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("cinemageddon.net");
  }

  async getSearchRequest(): Promise<Array<Request>> {
    const requests: Array<Request> = [];
    document
      .querySelectorAll("table.torrenttable tbody tr")
      ?.forEach((element: HTMLElement) => {
        const imdbId = parseImdbIdFromLink(element);
        const size = parseSize(
          element.querySelector("td:nth-child(5)")?.textContent as string
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
    return "CG";
  }

  async canUpload(request: Request) {
    if (!request.imdbId) return true;
    const queryUrl =
      "https://cinemageddon.net/browse.php?search=" +
      request.imdbId +
      "&orderby=size&dir=DESC";

    const result = await tracker_tools.http.fetchAndParseHtml(queryUrl);

    return result.textContent?.includes("Nothing found!");
  }

  insertTrackersSelect(select: HTMLElement): void {
    tracker_tools.dom.addChild(
      document.querySelector(".embedded > p") as HTMLElement,
      select
    );
  }
}
