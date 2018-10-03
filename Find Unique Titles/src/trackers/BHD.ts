import tracker_tools from "common";
import {parseImdbIdFromLink, parseSize} from "../utils/utils";
import {Request, tracker} from "./tracker";

export default class BHD implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("beyond-hd.me");
  }

  async getSearchRequest(): Promise<Array<Request>> {
    const requests: Array<Request> = [];
    document.querySelectorAll('.bhd-meta-box')
      .forEach((element) => {
         let imdbId = parseImdbIdFromLink(element as HTMLElement)

        let size = get_beyond_size(element as HTMLElement)
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
    return "BHD";
  }

  async canUpload(request: Request) {
    if (!request.imdbId) return true
    const queryUrl = 'https://beyond-hd.me/library/movies?activity=&q=' + request.imdbId

    const result = await tracker_tools.http.fetchAndParseHtml(queryUrl)

    return result.querySelectorAll('.bhd-meta-box').length === 0
  }

  insertTrackersSelect(select: HTMLElement): void {
    tracker_tools.dom.insertBefore(select, document.querySelector('.button-center') as HTMLElement)
  }
}

const get_beyond_size = (element: HTMLElement) => {

  return [...element.querySelectorAll('tr.bhd-sub-header-compact')].map((tr) => {
    let lines = [...tr.querySelectorAll('td')];
    if (lines.length === 1) return '0 MiB'
    else return lines.find(e => e.textContent?.includes(' GiB') || e.textContent?.includes(' MiB'))?.textContent

  }).map((element) => {
    if (!element) return 9999999
    return parseSize(element)

  })
    .filter(e => e !== null)
    .sort((a, b) => a!! < b!! ? 1 : -1)[0]


}
