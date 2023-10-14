import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import { Category, Request, toGenerator, Torrent, tracker } from "./tracker";
import tracker_tools from "common";

const parseCategory = (element: HTMLElement): Category => {
  const category = Category.MOVIE;
  let img = element.querySelectorAll("td img")[0];
  const imageSrc: string = img.attributes["src"].value;
  if (imageSrc.includes("40.jpg")) return Category.AUDIOBOOK;
  if (imageSrc.includes("41.jpg")) return Category.BOOK;
  if (img.attributes["title"].value.includes("Music")) return Category.MUSIC;
  return category;
};
const parseTorrent = (element: HTMLElement): Array<Torrent> => {
  const torrents: Array<Torrent> = [];
  const size = parseSize(
    element
      .querySelector("td:nth-child(11)")
      ?.textContent?.replace(",", "") as string
  );
  let resolution = "SD";
  let format = undefined;
  if (element.querySelector('td img[src*="hdrip1080.png"]')) {
    resolution = "1080p";
  } else if (element.querySelector('td img[src*="hdrip720.png"]')) {
    resolution = "720p";
  } else if (element.querySelector('td img[src*="dvdr.png"]')) {
    format = "VOB IFO";
  } else if (element.querySelector('td img[src*="bluray.png"]')) {
    format = "m2ts";
  }
  torrents.push({
    size,
    format,
    tags: [],
    resolution,
    dom: element,
  });
  return torrents;
};

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

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const requests: Array<Request> = [];
    document.querySelectorAll("#browse > tbody tr").forEach((element) => {
      let linksContainer = element.querySelector(
        "td:nth-child(2) > div > span:nth-child(1)"
      );
      if (linksContainer === null) return;
      const imdbId = parseImdbIdFromLink(linksContainer as HTMLElement);

      let torrents = parseTorrent(element as HTMLElement);
      const request: Request = {
        torrents,
        dom: element as HTMLElement,
        imdbId,
        query: "",
        category: parseCategory(element as HTMLElement),
      };
      requests.push(request);
    });

    yield* toGenerator(requests);
  }

  name(): string {
    return "KG";
  }

  async canUpload(request: Request) {
    if (!request.imdbId) return true;
    const queryUrl =
      "https://karagarga.in/browse.php?sort=size&search=" +
      request.imdbId +
      "&search_type=imdb&d=DESC";

    const result = await tracker_tools.http.fetchAndParseHtml(queryUrl);

    return result.querySelector("tr.oddrow") === null;
  }

  insertTrackersSelect(select: HTMLElement): void {
    tracker_tools.dom.insertBefore(
      select,
      document.getElementById("showdead") as HTMLElement
    );
  }
}
