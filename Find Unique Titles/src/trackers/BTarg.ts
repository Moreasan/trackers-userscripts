import { parseImdbId } from "../utils/utils";
import { Request, tracker } from "./tracker";
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

  async getSearchRequest(): Promise<Array<Request>> {
    const requests: Array<Request> = [];
    const rows = document.querySelectorAll("tr.browsetable");
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
      requests.push(request);
    }

    return requests;
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
