import { updateCount, updateTotalCount } from "../utils/dom";
import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import { tracker, Request, MetaData, toGenerator } from "./tracker";
import tracker_tools from "common";

const findTorrentsTable = () => {
  let tables = document.querySelectorAll("table");

  for (let table of tables) {
    let firstRow = table.querySelector("tr");
    let cells = firstRow.querySelectorAll("td");

    if (
      cells[0] &&
      cells[0].innerText === "Type" &&
      cells[1] &&
      cells[1].innerText === "Name" &&
      cells[2] &&
      cells[3].innerText === "Director"
    ) {
      return table;
    }
  }
  console.log("No torrents table found.");
  return undefined;
};
export default class TiK implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return url.includes("cinematik.net");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const requests: Array<Request> = [];
    const torrentsTable = findTorrentsTable();
    if (!torrentsTable) {
      yield {
        total: 0,
      };
      return
    }
    let nodes = torrentsTable.querySelectorAll("tr");
    updateTotalCount(nodes.length - 1);
    let i = 1;
    for (let i = 1; i < nodes.length; i++) {
      const element = nodes[i];
      updateCount(i);
      const link: HTMLAnchorElement | null = element.querySelector(
        'a[href*="details.php?id"]'
      );
      if (!link) {
        continue;
      }
      let response = await tracker_tools.http.fetchAndParseHtml(
        (link as HTMLAnchorElement).href
      );
      const imdbId = parseImdbIdFromLink(response as HTMLElement);
      const size = parseSize(element.children[6].textContent as string);

      const request: Request = {
        torrents: [
          {
            size,
            tags: [],
            dom: element,
          },
        ],
        dom: element as HTMLElement,
        imdbId,
        query: "",
      };
      requests.push(request);
    }

    yield* toGenerator(requests);
  }

  name(): string {
    return "TiK";
  }

  async canUpload(request: Request) {
    return false;
  }

  insertTrackersSelect(select: HTMLElement): void {
    const stateSelect = document.getElementById("incldead");
    const td = document.createElement("td");
    td.appendChild(select);
    tracker_tools.dom.insertBefore(td, stateSelect.parentElement);
  }
}
