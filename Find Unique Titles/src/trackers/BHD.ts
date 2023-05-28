import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import { Request, Torrent, tracker } from "./tracker";
import tracker_tools from "common";

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

    const parseTorrents = (element: HTMLElement): Array<Torrent> => {
      const torrents = [];
      element.querySelectorAll('tr[id^="resulttorrent"]').forEach((line) => {
        const data = line.children[0].textContent.trim().split("/");
        const size = parseSize(line.children[4].textContent.trim());
        const tags = [];
        if (line.textContent.includes("Remux")) {
          tags.push("Remux");
        }
        const torrent: Torrent = {
          container: data[0].trim(),
          format: data[1].trim(),
          resolution: data[3].trim(),
          tags: tags,
          size,
          dom: line as HTMLElement,
        };
        torrents.push(torrent);
      });
      return torrents;
    };

    document.querySelectorAll(".bhd-meta-box").forEach((element) => {
      let imdbId = parseImdbIdFromLink(element as HTMLElement);

      const request: Request = {
        torrents: parseTorrents(element as HTMLElement),
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
    if (!request.imdbId) return true;
    const queryUrl =
      "https://beyond-hd.me/library/movies?activity=&q=" + request.imdbId;

    const result = await tracker_tools.http.fetchAndParseHtml(queryUrl);

    return result.querySelectorAll(".bhd-meta-box").length === 0;
  }

  insertTrackersSelect(select: HTMLElement): void {
    select.classList.add("beta-form-main");
    select.style.width = "170px";
    tracker_tools.dom.insertBefore(
      select,
      document.querySelector(".button-center") as HTMLElement
    );
  }
}
