import tracker_tools from "common";
import {parseImdbIdFromLink, parseSize} from "../utils/utils";
import {tracker, Request} from "./tracker";

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
    document.querySelectorAll('table.torrenttable tbody tr')
      ?.forEach((element) => {

        const imdbId = parseImdbIdFromLink(element as HTMLElement)
        const size = parseSize(element.querySelector('td:nth-child(5)')?.textContent as string)

        const request: Request = {
          data: {
            format: null,
            resolution: null,
            size,
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
    return "CG";
  }

  async canUpload(request: Request) {
    if (!request.imdbId) return true
    const queryUrl = 'https://cinemageddon.net/browse.php?search=' + request.imdbId + '&orderby=size&dir=DESC'

    const result = await tracker_tools.http.fetchAndParseHtml(queryUrl)

    return result.textContent?.includes("Nothing found!");



  }

  insertTrackersSelect(select: HTMLElement): void {
    tracker_tools.dom.addChild(document.querySelector('.embedded > p') as HTMLElement, select)
  }
}
