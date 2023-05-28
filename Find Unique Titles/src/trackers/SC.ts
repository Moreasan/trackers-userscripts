import tracker_tools from "common";
import {parseImdbIdFromLink, parseSize} from "../utils/utils";
import { tracker, Request } from "./tracker";

export default class SC implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("secret-cinema.pw");
  }

  async getSearchRequest(): Promise<Array<Request>> {
    const requests: Array<Request> = [];
    document
      .querySelectorAll(".torrent_card")
      .forEach((element: HTMLElement) => {
        let dom: Element = element;
        let links_container: HTMLElement | null = element.querySelector(".torrent_tags");

        if (links_container === null) return;
        let imdbId = parseImdbIdFromLink(links_container);

        let size = parseSize(
          element.querySelector(".torrent_info .activity_info")!!
            .querySelectorAll("div")[1].textContent as string
        );

        const request: Request = {
            torrents: [{
                size,
                tags: [],
                dom: element
            }],
          dom: dom,
          imdbId,
          query: "",
        };
        requests.push(request);
      });

    return requests;
  }

  name(): string {
    return "SC";
  }

  async canUpload(request: Request) {
    if (!request.imdbId) return true
    const queryUrl = `https://secret-cinema.pw/torrents.php?action=advanced&searchsubmit=1&filter_cat=1&cataloguenumber=${request.imdbId}&order_by=time&order_way=desc&tags_type=0`
    const result = await tracker_tools.http.fetchAndParseHtml(queryUrl)
    return result.querySelector('.torrent_card_container') === null
  }

  insertTrackersSelect(select: HTMLElement): void {
    tracker_tools.dom.addChild(document.querySelector("#ft_container p") as HTMLElement, select);
  }
}
