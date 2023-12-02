import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import { Category, Request, toGenerator, tracker, MetaData } from "./tracker";
import { fetchAndParseHtml } from "common/http";
import { addChild } from "common/dom";

function parseTorrent(element: HTMLElement) {
  let infos = element
    .querySelector(".torrent_info .activity_info")!!
    .querySelectorAll("div");
  let size = parseSize(infos[1].textContent as string);
  let resolution = infos[0].textContent.trim();
  if (resolution == "CD" || resolution == "WEB") {
    resolution = undefined;
  }
  let format = undefined;
  if (resolution === "DVD-R") {
    resolution = "SD";
    format = "VOB IFO";
  }
  return {
    size,
    tags: [],
    dom: element,
    resolution,
    format,
  };
}

function parseCategory(element: HTMLElement) {
  let category = Category.MOVIE;
  let infos = element
    .querySelector(".torrent_info .activity_info")!!
    .querySelectorAll("div");
  let info = infos[0].textContent;
  if (info == "CD" || info === "WEB") {
    category = Category.MUSIC;
  } else if (parseSize(infos[0].textContent as string)) {
    category = Category.BOOK;
  }
  return category;
}

export default class SC implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("secret-cinema.pw") && !url.includes("torrents.php?id");
  }

async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const requests: Array<Request> = [];
    document
      .querySelectorAll(".torrent_card")
      .forEach((element: HTMLElement) => {
        let dom: Element = element;
        let links_container: HTMLElement | null =
          element.querySelector(".torrent_tags");

        if (links_container === null) return;
        let imdbId = parseImdbIdFromLink(links_container);

        const request: Request = {
          torrents: [parseTorrent(element)],
          dom: dom,
          imdbId,
          title: "",
          category: parseCategory(element),
        };
        requests.push(request);
      });

  yield* toGenerator(requests)

}

  name(): string {
    return "SC";
  }

  async canUpload(request: Request) {
    if (!request.imdbId) return true;
    const queryUrl = `https://secret-cinema.pw/torrents.php?action=advanced&searchsubmit=1&cataloguenumber=${request.imdbId}&order_by=time&order_way=desc&tags_type=0`;
    const result = await fetchAndParseHtml(queryUrl);
    return result.querySelector(".torrent_card_container") === null;
  }

  insertTrackersSelect(select: HTMLElement): void {
    addChild(
      document.querySelector("#ft_container p") as HTMLElement,
      select
    );
  }
}
