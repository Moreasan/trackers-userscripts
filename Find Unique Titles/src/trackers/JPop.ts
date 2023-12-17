import { parseContainerAndFormat, parseSize } from "../utils/utils";
import { Category, MetaData, MusicReleaseType, MusicRequest, Request, SearchResult, Torrent, tracker } from "./tracker";
import { insertBefore } from "common/dom";


const parseYear = (element: HTMLElement) => {
  const text = element.children[3]!!.textContent!!.trim();
  const match = text.match(/\[(\d{4})(\.\d{2}\.\d{2})?]/);
  return match ? parseInt(match[1]) : null;
};
const parseType = (element: HTMLElement) => {
  const type = element.children[1].textContent!!.trim();
  if (type == "Album") return MusicReleaseType.ALBUM;
  if (type == "TV-Music") return MusicReleaseType.TV_MUSIC;

  return null;
};
const parseTorrents = (element: HTMLElement): Array<Torrent> => {
  if (element.classList.contains("torrent_redline")) {
    const size = parseSize(element.children[6].textContent);
    const { format, container } = parseContainerAndFormat(
      element.children[3]!!.textContent!!.trim()
    );
    return [
      {
        size,
        dom: element,
        format,
        container,
      },
    ];
  } else {
    const groupId = element
      .querySelector('a[title*="View Torrent"]')!!
      .href.split("id=")[1];
    return Array.from(document.querySelectorAll(`tr.groupid_${groupId}`)).map(
      (element) => {
        const size = parseSize(element.children[3].textContent);
        const { format, container } = parseContainerAndFormat(
          element.children[0].textContent!!.trim()
        );
        return {
          size,
          dom: element,
          format,
          container,
        };
      }
    );
  }
};
const parseArtist = (element: Element): string[] => {
  const artists = new Set<string>();
  artists.add(element.textContent?.trim()!!);
  const title = element.getAttribute("title")!!.split(" (View Artist)");
  if (title.length == 2) {
    artists.add(title[0].trim());
  }

  return Array.from(artists);
};

const parseAlbum = (element: Element): string[] => {
  const titles = new Set<string>();
  titles.add(element.textContent?.trim()!!);
  const title = element.getAttribute("title")!!.split(" (View Torrent)");
  if (title.length == 2) {
    titles.add(title[0].trim());
  }

  return Array.from(titles);
};
export default class JPop implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return url.includes("jpopsuki.eu");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const elements = Array.from(
      document.querySelectorAll(".group_redline, .torrent_redline")
    ) as Array<HTMLElement>;
    yield {
      total: elements.length,
    };
    for (const element of elements) {
      const artists = parseArtist(
        element.querySelector('a[title*="View Artist"]')!!
      );
      const titles = parseAlbum(
        element.querySelector('a[title*="View Torrent"]')!!
      );
      const year = parseYear(element);
      const type = parseType(element);
      const torrents = parseTorrents(element);

      const request: MusicRequest = {
        torrents,
        dom: [element],
        titles,
        artists,
        type,
        year,
        category: Category.MUSIC,
      };
      yield request;
    }
  }

  name(): string {
    return "JPop";
  }

  async search(request: Request): Promise<SearchResult> {
    return SearchResult.NOT_CHECKED;
  }

  insertTrackersSelect(select: HTMLElement): void {
    const element = document.querySelector('div.submit input[type="submit"]');
    if (element) insertBefore(select, element as HTMLElement);
  }
}
