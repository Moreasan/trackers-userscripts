import tracker_tools from "common";
import {parseImdbIdFromLink} from "../utils/utils";
import {tracker, Request} from "./tracker";

export default class CG implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return url.includes("iptorrents.com/movies");
  }

  async getSearchRequest(): Promise<Array<Request>> {
    const requests: Array<Request> = [];
    document.querySelectorAll('.mBox table')
      ?.forEach((element) => {

        const imdbId = parseImdbIdFromLink(element as HTMLElement)
        const size = null

        const request: Request = {
          torrents: [],
          dom: element.parentElement,
          imdbId,
          query: "",
        };
        requests.push(request);
      });

    return requests;
  }

  name(): string {
    return "HDT";
  }

  async canUpload(request: Request) {
    return false
  }

  insertTrackersSelect(select: HTMLElement): void {
    const element = document.createElement('p')
    tracker_tools.dom.addChild(element, select)
    tracker_tools.dom.insertAfter(element, document.querySelector('.mBox form input[name="q"]').closest('p'))
  }
}
