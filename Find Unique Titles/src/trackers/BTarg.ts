import { parseImdbId } from "../utils/utils";
import { MetaData, Request, tracker } from "./tracker";
import { fetchAndParseHtml } from "common/http";
import { insertAfter } from "common/dom";

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
      let response = await fetchAndParseHtml(
        (link as HTMLAnchorElement).href
      );
      const imdbId = parseImdbId(response.textContent as string);
      const request: Request = {
        torrents: [],
        dom: row as HTMLElement,
        imdbId,
        title: "",
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
    insertAfter(
      select,
      document.querySelector('select[name="inclfree"]') as HTMLElement
    );
  }
}
