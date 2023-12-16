import { parseImdbIdFromLink, parseResolution, parseYearAndTitle } from "../utils/utils";
import { MetaData, Request, SearchResult, tracker, Category } from "./tracker";
import { insertBefore } from "common/dom";
import { fetchAndParseHtml } from "common/http";

export default class CLANSUD implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return (
      url.includes("www.clan-sudamerica.net/invision/") &&
      !url.includes("forums/topic/")
    );
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const topics = (
      Array.from(
        document.querySelectorAll('div[data-tableid="topics"] table')
      ) as Array<HTMLElement>
    ).filter((topic) => {
      if (
        topic.getAttribute("bgColor") != null &&
        !topic.getAttribute("bgcolor") != null
      ) {
        return false;
      }
      if (topic.querySelectorAll("img").length === 0) {
        return false;
      }

      if (topic.querySelectorAll("img").length != 3) {
        return false;
      }
      if (topic.querySelectorAll("img")[2].alt !== "peliscr.jpg") {
        topic.style.display = "none";
        return false;
      }
      return true;
    });
    yield {
      total: topics.length,
    };
    for (const topic of topics) {
      const link = (topic.querySelector("a") as HTMLAnchorElement).href;
      let response = await fetchAndParseHtml(link);
      const imdbId = parseImdbIdFromLink(response);
      const fullTitle = topic
        .querySelectorAll("tr td")!![1]
        ?.textContent?.trim()
        ?.split("\n")[0];
      const { title, year } = parseYearAndTitle(fullTitle);
      const request: Request = {
        torrents: [{
          resolution: parseResolution(fullTitle),
          tags: [],
          dom: topic
        }],
        dom: [topic],
        imdbId,
        title,
        year,
        category: Category.MOVIE,
      };
      yield request;
    }
  }

  name(): string {
    return "CLAN-SUD";
  }

  async search(request: Request): Promise<SearchResult> {
    return SearchResult.NOT_CHECKED;
  }

  insertTrackersSelect(select: HTMLElement): void {
    const parent = document.querySelector(
      'div[data-tableid="topics"]'
    ) as HTMLElement;
    if (parent) insertBefore(select, parent);
  }
}
