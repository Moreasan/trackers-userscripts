import { parseImdbIdFromLink } from "../utils/utils";
import { MetaData, Request, SearchResult, tracker } from "./tracker";
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
    const requests: Array<Request> = [];
    const topics = document.querySelectorAll(
      'div[data-tableid="topics"] table'
    );
    yield {
      total: topics.length,
    };
    for (const topic of topics) {
      if (
        topic.getAttribute("bgColor") != null &&
        !topic.getAttribute("bgcolor") != null
      ) {
        continue;
      }
      if (topic.querySelectorAll("img").length === 0) continue;

      if (topic.querySelectorAll("img").length != 3) continue;
      if (topic.querySelectorAll("img")[2].alt !== "peliscr.jpg") {
        (topic as HTMLElement).style.display = "none";
        continue;
      }
      const link = (topic.querySelector("a") as HTMLAnchorElement).href;
      let response = await fetchAndParseHtml(link);
      const imdbId = parseImdbIdFromLink(response);
      const request: Request = {
        torrents: [],
        dom: [topic as HTMLElement],
        imdbId,
        title: "",
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
    insertBefore(
      select,
      document.querySelector('div[data-tableid="topics"]') as HTMLElement
    );
  }
}