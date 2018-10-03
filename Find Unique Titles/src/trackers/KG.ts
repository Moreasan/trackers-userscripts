import tracker_tools from "common";
import {parseImdbIdFromLink, parseSize} from "../utils/utils";
import { tracker, Request } from "./tracker";

export default class KG implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("karagarga.in");
  }

  async getSearchRequest(): Promise<Array<Request>> {
    const requests: Array<Request> = [];
    document.querySelector('#browse > tbody')
      ?.querySelectorAll('tr')
      .forEach((element) => {
        let linksContainer = element.querySelector('td:nth-child(2) > div > span:nth-child(1)')
        if (linksContainer === null) return
        const imdbId = parseImdbIdFromLink(linksContainer as HTMLElement)

        const size = parseSize(element.querySelector('td:nth-child(11)')?.textContent?.replace(',', '') as string)

        const request: Request = {
          data: {
            format: null,
            resolution: null,
            size,
            tags: null,
          },
          dom: element,
          imdbId,
          query: "",
        };
        requests.push(request);
      });

    return requests;
  }

  name(): string {
    return "KG";
  }

  async canUpload(request: Request) {
    if (!request.imdbId) return true
    const queryUrl = 'https://karagarga.in/browse.php?sort=size&search=' + request.imdbId + '&search_type=imdb&d=DESC'

    const result = await tracker_tools.http.fetchAndParseHtml(queryUrl)

    return result.querySelector('tr.oddrow') === null;



  }

  insertTrackersSelect(select: HTMLElement): void {
    tracker_tools.dom.insertBefore(select, document.getElementById('showdead') as HTMLElement)
  }
}
