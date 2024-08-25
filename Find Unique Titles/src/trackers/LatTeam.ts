import {
  parseCodec,
  parseResolution,
  parseSize,
  parseTags,
  parseYearAndTitle,
} from "../utils/utils";
import { Category, MetaData, Request, SearchResult, AbstractTracker } from "./tracker";
import { addChild } from "common/dom";

const parseCategory = (element: Element) => {
  const icon = element.querySelector(".torrent-search--list__category i");
  if (!icon) return Category.OTHER;
  if (icon?.classList.contains("fa-film")) return Category.MOVIE;
  if (icon?.classList.contains("fa-tv-retro")) return Category.TV;

  return Category.OTHER;
};
export default class LatTeam extends AbstractTracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return url.includes("lat-team.com");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const rows = document.querySelectorAll(
      ".torrent-search--list__results tbody tr"
    );
    let elements = Array.from(rows);
    yield {
      total: elements.length,
    };
    for (let element of elements) {
      const imdbId = element.getAttribute("data-imdb-id");
      let fullTitle = element
        .querySelector("a.torrent-search--list__name")
        ?.textContent?.trim();
      const { title, year } = parseYearAndTitle(fullTitle);
      const size = parseSize(
        element
          .querySelector(".torrent-search--list__size")
          ?.textContent?.trim()
      );
      const tags = parseTags(fullTitle);
      const category = parseCategory(element);
      const resolution = parseResolution(
        element
          .querySelector(".torrent-search--list__resolution")
          ?.textContent?.trim()
      );

      const request: Request = {
        torrents: [
          {
            dom: element,
            size,
            tags,
            resolution,
            container: parseCodec(fullTitle),
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
    return "LatTeam";
  }

  insertTrackersSelect(select: HTMLElement): void {
    select.classList.add("form__select");
    select.style.width = "180px";
    addChild(
      document.querySelector(
        ".panelV2.torrent-search__results .panel__actions"
      ) as HTMLElement,
      select
    );
  }
}
