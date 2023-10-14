import { parseImdbId } from "../utils/utils";
import { MetaData, Request, tracker } from "./tracker";
import tracker_tools from "common";

export default class BTarg implements tracker {
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
    const rows = document.querySelectorAll("tr.browsetable");
    yield {
      total: rows.length,
    };
    for (const row of rows) {
      const link: HTMLAnchorElement | null = row.querySelector(
        'a[href*="details.php?id"]'
      );
      if (!link) {
        continue;
      }
      if (link.href.includes("#")) {
        continue;
      }
      let response = await tracker_tools.http.fetchAndParseHtml(
        (link as HTMLAnchorElement).href
      );
      const imdbId = parseImdbId(response.textContent as string);
      const request: Request = {
        torrents: [],
        dom: row as HTMLElement,
        imdbId,
        query: "",
      };
      yield request;
    }
  }

  name(): string {
    return "BTarg";
  }

  async canUpload(request: Request) {
    return false;
  }

  insertTrackersSelect(select: HTMLElement): void {
    tracker_tools.dom.insertAfter(
      select,
      document.querySelector('select[name="inclfree"]') as HTMLElement
    );
  }
}
