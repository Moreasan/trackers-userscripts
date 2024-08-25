import { parseImdbId, parseSize } from "../utils/utils";
import { Category, MetaData, Request, SearchResult, AbstractTracker } from "./tracker";
import { insertAfter } from "common/dom";
import { fetchAndParseHtml } from "common/http";

const parseCategory = (element: HTMLElement) => {
  const category = element.children[0]!!.querySelector("a")!!.href;
  if (category.includes("cat=02")) return Category.MOVIE;
  if (category.includes("cat=03")) return Category.TV;
  if (category.includes("cat=05")) return Category.XXX;
  if (category.includes("cat=08")) return Category.LIVE_PERFORMANCE;
  return Category.OTHER;
};

export default class BTarg extends AbstractTracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return url.includes("https://btarg.com.ar");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const items = Array.from(
      document.querySelectorAll('tr a[href*="details.php?id"]')
    ).filter(
      (link) => !link.href.includes("#") && link.href.includes("/details.php")
    );
    yield {
      total: items.length,
    };
    for (const item of items) {
      let response = await fetchAndParseHtml((item as HTMLAnchorElement).href);
      const imdbId = parseImdbId(response.textContent as string);
      const size = parseSize(
        item.parentElement?.nextElementSibling?.textContent as string
      );
      const request: Request = {
        torrents: [
          {
            size,
            dom: item.parentElement?.parentElement as HTMLElement,
            tags: [],
          },
        ],
        dom: [
          item.parentElement?.parentElement as HTMLElement,
          item.parentElement?.parentElement?.nextElementSibling as HTMLElement,
        ],
        imdbId,
        title: "",
        category: parseCategory(item.parentElement!!.parentElement!!)
      };
      yield request;
    }
  }

  name(): string {
    return "BTarg";
  }

  async search(request: Request): Promise<SearchResult> {
    return SearchResult.NOT_CHECKED;
  }

  insertTrackersSelect(select: HTMLElement): void {
    insertAfter(
      select,
      document.querySelector('select[name="inclfree"]') as HTMLElement
    );
  }
}