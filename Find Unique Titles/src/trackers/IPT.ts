import {
  parseContainerAndFormat,
  parseImdbIdFromLink,
  parseResolution,
  parseSize,
  parseTags,
  parseYear,
  parseYearAndTitle,
} from "../utils/utils";
import {
  Category,
  MetaData,
  MusicReleaseType,
  Request,
  SearchResult,
  tracker,
} from "./tracker";
import { insertAfter } from "common/dom";
import { fetchAndParseHtml } from "common/http";

const parseCategory = (element: HTMLElement): Category => {
  let categoryImg = element.children[0].querySelector("img")!!;
  const categoryLogo = categoryImg.src!!;
  const alt = categoryImg.alt;
  if (categoryLogo.includes("Movies-") || alt.includes("Movie"))
    return Category.MOVIE;
  if (categoryLogo.includes("TV-")) return Category.TV;
  if (categoryLogo.includes("Music-")) return Category.MUSIC;
};
export default class CG implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return url.includes("ptorrents.com/t?");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const elements = Array.from(
      document.querySelectorAll("#torrents tbody tr")
    ) as Array<HTMLElement>;
    yield {
      total: elements.length,
    };
    for (let element of elements) {
      const category = parseCategory(element);
      let request: Request = {
        dom: [element as HTMLElement],
        category,
      };
      const link: HTMLAnchorElement | null =
        element.children[1].querySelector("a");
      const torrentTitle = link?.textContent!!;
      const size = parseSize(element.children[5].textContent);
      if (category == Category.MOVIE) {
        let response = await fetchAndParseHtml(
          (link as HTMLAnchorElement).href
        );
        const imdbId = parseImdbIdFromLink(response as HTMLElement);
        const { year, title } = parseYearAndTitle(torrentTitle);
        request = {
          ...request,
          torrents: [
            {
              dom: element,
              size,
              resolution: parseResolution(torrentTitle),
              tags: parseTags(torrentTitle),
            },
          ],
          year,
          imdbId,
          title,
        };
      } else if (category == Category.MUSIC) {
        const splittedTitle = torrentTitle.split("-")!!;
        const artists = [splittedTitle[0]];
        const titles = [splittedTitle[1]];
        const year = parseYear(torrentTitle);
        const { container, format } = parseContainerAndFormat(torrentTitle);
        request = {
          ...request,
          torrents: [
            {
              dom: element,
              size,
              format,
              container,
            },
          ],
          artists,
          titles,
          year,
          type: MusicReleaseType.ALBUM,
        };
      }
      yield request;
    }
  }

  name(): string {
    return "IPT";
  }

  async search(request: Request): Promise<SearchResult> {
    return SearchResult.NOT_CHECKED;
  }

  insertTrackersSelect(select: HTMLElement): void {
    insertAfter(
      select,
      document.querySelector('input[name="q"]') as HTMLElement
    );
  }
}
