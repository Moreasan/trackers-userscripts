import tracker_tools from "common";
import {parseImdbIdFromLink, parseSize} from "../utils/utils";
import {tracker, Request} from "./tracker";
import {updateCount, updateTotalCount} from '../utils/dom';

export default class FL implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("filelist.io");
  }

  async getSearchRequest(): Promise<Array<Request>> {
    const requests: Array<Request> = [];
    let nodes = document.querySelectorAll('.torrentrow');
    updateTotalCount(nodes.length)
    let i = 1
    for (const element of nodes) {
      updateCount(i++)
      const link: HTMLAnchorElement | null = element.querySelector('a[href*="details.php?id"]')
      if (!link) {
        continue;
      }
      let response = await tracker_tools.http.fetchAndParseHtml((link as HTMLAnchorElement).href)
      const imdbId = parseImdbIdFromLink(response as HTMLElement)
      const size = parseSize(element.querySelector('.torrenttable:nth-child(7)')?.textContent as string)

      const request: Request = {
        torrents: [],
        dom: element as HTMLElement,
        imdbId,
        query: "",
      };
      requests.push(request);
    }

    return requests;
  }

  name(): string {
    return "FL";
  }

  async canUpload(request: Request) {
    if (!request.imdbId) return true
    const queryUrl = 'https://filelist.io/browse.php?search=' + request.imdbId + '&cat=0&searchin=1&sort=3'

    const result = await tracker_tools.http.fetchAndParseHtml(queryUrl)

    return result.querySelectorAll('.torrentrow').length === 0;

  }

  insertTrackersSelect(select: HTMLElement): void {
    tracker_tools.dom.addChild(document.querySelector('form p') as HTMLElement, select)
  }
}
