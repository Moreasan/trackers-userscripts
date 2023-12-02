import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import { Category, MetaData, Request, toGenerator, tracker } from "./tracker";
import { fetchAndParseHtml } from "common/http";
import { addChild } from "common/dom";

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
  let resolution = "SD";
  const text = element.textContent.toLowerCase();
  if (text.includes("1080p")) {
    resolution = "1080p";
  } else if (text.includes("720p")) {
    resolution = "720p";
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

async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const requests: Array<Request> = [];
    document
      .querySelectorAll("table.torrenttable tbody tr")
      ?.forEach((element: HTMLElement) => {
        const imdbId = parseImdbIdFromLink(element);
        const category = parseCategory(element);

        const request: Request = {
          torrents: parseTorrents(element),
          dom: element,
          imdbId,
          title: "",
          category,
        };
        requests.push(request);
      });

    yield* toGenerator(requests)
  }

  name(): string {
    return "CG";
  }

  async canUpload(request: Request) {
    if (!request.imdbId) return true;
    const queryUrl =
      "https://cinemageddon.net/browse.php?search=" +
      request.imdbId +
      "&orderby=size&dir=DESC";

    const result = await fetchAndParseHtml(queryUrl);

    return result.textContent?.includes("Nothing found!");
  }

  insertTrackersSelect(select: HTMLElement): void {
    addChild(
      document.querySelector(".embedded > p") as HTMLElement,
      select
    );
  }
}
