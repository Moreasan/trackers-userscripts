import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import { Category, MetaData, Request, Resolution, SearchResult, toGenerator, AbstractTracker } from "./tracker";
import { addChild } from "common/dom";
import { fetchAndParseHtml } from "common/http";

const parseCategory = (element: HTMLElement) => {
  const text = element.textContent.toLowerCase();
  if (text.includes("ebook")) {
    return Category.BOOK;
  }

  return Category.MOVIE;
};

function parseTorrents(element: HTMLElement) {
  const size = parseSize(
    element.querySelector("td:nth-child(5)")?.textContent as string
  );
  let container = undefined;
  let format = undefined;
  let resolution = Resolution.SD;
  const text = element.textContent!!.toLowerCase();
  if (text.includes("1080p")) {
    resolution = Resolution.FHD;
  } else if (text.includes("720p")) {
    resolution = Resolution.HD;
  } else if (text.includes("dvd-r")) {
    format = "VOB IFO";
  }
  return [
    {
      size,
      tags: [],
      dom: element,
      resolution,
      container,
      format,
    },
  ];
}

export default class CG extends AbstractTracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("cinemageddon.net");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const requests: Array<Request> = [];
    document
      .querySelectorAll("table.torrenttable tbody tr")
      ?.forEach((element: HTMLElement) => {
        const imdbId = parseImdbIdFromLink(element);
        const category = parseCategory(element);

        const request: Request = {
          torrents: parseTorrents(element),
          dom: [element],
          imdbId,
          title: "",
          category,
        };
        requests.push(request);
      });

    yield* toGenerator(requests);
  }

  name(): string {
    return "CG";
  }

  async search(request: Request): Promise<SearchResult> {
    if (!request.imdbId) return SearchResult.NOT_CHECKED;
    const queryUrl =
      "https://cinemageddon.net/browse.php?search=" +
      request.imdbId +
      "&orderby=size&dir=DESC";

    const result = await fetchAndParseHtml(queryUrl);

    return result.textContent!!.includes("Nothing found!") ? SearchResult.NOT_EXIST
      : SearchResult.EXIST;
  }

  insertTrackersSelect(select: HTMLElement): void {
    addChild(document.querySelector(".embedded > p") as HTMLElement, select);
  }
}
