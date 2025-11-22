import {
  parseImdbIdFromLink,
  parseResolution,
  parseSize,
  parseTags,
  parseYearAndTitle,
} from "../utils/utils";
import {
  MetaData,
  Request,
  SearchResult,
  AbstractTracker,
} from "./tracker";
import { addChild } from "common/dom";
import { fetchAndParseHtml } from "common/http";
export default class DiscFan extends AbstractTracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return url.includes("https://discfan.net");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    let elements = Array.from(
      document.querySelectorAll(".torrents")[0].children[0].children
    ).filter((element) =>
      element.querySelector(".torrentname")
    ) as Array<HTMLElement>;
    yield {
      total: elements.length,
    };
    for (const element of elements) {
      const link: HTMLAnchorElement | null = element.querySelector(
        'a[href*="details.php?id"]'
      );
      if (!link) {
        continue;
      }
      let response = await fetchAndParseHtml((link as HTMLAnchorElement).href);
      const imdbId = parseImdbIdFromLink(response as HTMLElement);

      const size = parseSize(element.children[4]?.textContent as string);
      const fullTitle = element.querySelector(".torrentname a")?.textContent;
      const { title, year } = parseYearAndTitle(fullTitle);
      const request: Request = {
        torrents: [
          {
            size,
            tags: parseTags(fullTitle),
            resolution: parseResolution(fullTitle),
            dom: element,
          },
        ],
        dom: [element],
        imdbId,
        title,
        year,
      };
      yield request;
    }
  }

  name(): string {
    return "DiscFan";
  }

  async search(request: Request): Promise<SearchResult> {
    return SearchResult.NOT_CHECKED;
  }

  insertTrackersSelect(select: HTMLElement): void {
    const element = document
      .querySelector(".searchbox")
      ?.children[2].querySelector("td td.rowfollow tr");
    if (element) addChild(element as HTMLElement, select);
  }
}
