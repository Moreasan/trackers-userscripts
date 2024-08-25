import {
  parseImdbIdFromLink,
  parseResolution,
  parseSize,
  parseTags,
  parseYearAndTitle,
} from "../utils/utils";
import { Category, MetaData, Request, SearchResult, AbstractTracker } from "./tracker";
import { addChild } from "common/dom";

const isTV = (title: string) => {
  const tvPatterns = [/S\d{2}E\d{2}/i, /S\d{2}/i, /EP\d{2,3}/i];

  return tvPatterns.some((pattern) => pattern.test(title));
};

const getCategory = (element: HTMLElement) => {
  let categoryTitle = element
    .querySelector("img")
    ?.getAttribute("title")
    ?.toLocaleLowerCase();
  if (categoryTitle?.includes("anime")) return Category.ANIME;
  if (categoryTitle?.includes("misc")) return Category.OTHER;

  const title = element.querySelector(".torrentname a")?.getAttribute("title");
  let category = Category.MOVIE;
  if (title && isTV(title)) {
    category = Category.TV;
  }
  return category;
};
export default class MTeam extends AbstractTracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return (
      url.includes("https://kp.m-team.cc") &&
      (url.includes("torrents.php") || url.includes("movie.php"))
    );
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
      let imdbId = parseImdbIdFromLink(element.querySelector(".torrentname"));
      if (imdbId) {
        imdbId = imdbId.replace("tt0", "tt");
      }
      const size = parseSize(element.children[6]?.textContent as string);
      const fullTitle = element
        .querySelector(".torrentname a")
        ?.getAttribute("title");
      const { title, year } = parseYearAndTitle(fullTitle);
      let category = getCategory(element);
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
        category,
      };
      yield request;
    }
  }

  name(): string {
    return "M-Team";
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
