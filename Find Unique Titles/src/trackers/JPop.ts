import { parseSize } from "../utils/utils";
import {
  Category,
  MetaData,
  MusicReleaseType,
  MusicRequest,
  Request,
  SearchResult,
  Torrent,
  tracker,
} from "./tracker";
import { insertBefore } from "common/dom";

const parseYear = (element: HTMLElement) => {
  const text = element.children[3]!!.textContent!!.trim();
  const match = text.match(/(\d{4})\.\d{2}\.\d{2}/);
  return match ? parseInt(match[1]) : null;
};
const parseType = (element: HTMLElement) => {
  const type = element.children[1].textContent!!.trim();
  if (type == "Album") return MusicReleaseType.ALBUM;
  if (type == "TV-Music") return MusicReleaseType.TV_MUSIC;

  return null;
};
const parseContainer = (
  element: HTMLElement
): { container?: string; format?: string } => {
  const text = element.textContent!!.trim();
  const containers = ["FLAC", "MP3"];
  const formats = ["Lossless", "320", "V0"];
  let result = {};
  for (let container of containers) {
    if (text.includes(container)) {
      result = {
        container,
      };
    }
  }
  for (let format of formats) {
    if (text.includes(format)) {
      result = {
        ...result,
        format,
      };
    }
  }

  return result;
};
const parseTorrents = (element: HTMLElement): Array<Torrent> => {
  if (element.classList.contains("torrent_redline")) {
    const size = parseSize(element.children[6].textContent);
    const { format, container } = parseContainer(
      element.children[3]!! as HTMLElement
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
        const { format, container } = parseContainer(
          element.children[0] as HTMLElement
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
      const artist = element
        .querySelector('a[title*="View Artist"]')
        ?.textContent?.trim();
      const title = element
        .querySelector('a[title*="View Torrent"]')
        ?.textContent?.trim();
      const year = parseYear(element);
      const type = parseType(element);
      const torrents = parseTorrents(element);

      const request: MusicRequest = {
        torrents,
        dom: [element],
        title,
        artist,
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
