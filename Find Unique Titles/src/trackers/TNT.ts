import {
  parseCodec,
  parseContainerAndFormat,
  parseResolution,
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
import { addChild } from "common/dom";
import { fetchAndParseJson, sleep } from "common/http";
import { logger } from "common/logger";

const parseCategory = (category: number) => {
  if (
    [24, 18, 17, 20, 19, 34, 36, 45, 22, 37, 35, 43, 38, 39, 46].includes(
      category
    )
  )
    return Category.MOVIE;
  if ([27, 28, 16, 2, 29, 40, 41, 42].includes(category)) return Category.TV;
  if ([10, 12, 13, 14].includes(category)) return Category.GAME;
  if ([1].includes(category)) return Category.AUDIOBOOK;
  if ([8].includes(category)) return Category.BOOK;
  if ([2, 41].includes(category)) return Category.ANIME;
  if ([44, 25, 26].includes(category)) return Category.MUSIC;
};

const getTorrentTitle = (element: HTMLElement) => {
  const h5 = element.children[1].querySelector("h5")!!;
  const newTag = h5.querySelector(".newTag");
  if (newTag) {
    h5.removeChild(newTag);
  }
  return h5!!.textContent!!;
};

export default class TNT implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return false;
  }

  canRun(url: string): boolean {
    return url.includes("tntracker.org") && url.includes('/?perPage=');
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    logger.debug(`[{0}] Parsing titles to check`, this.name());
    const elements = Array.from(
      document.querySelectorAll("#table_gen_wrapper .sTable tbody tr")
    );
    yield {
      total: elements.length,
    };
    for (let element of elements) {
      const torrentTitle = getTorrentTitle(element);
      logger.debug("[TNT] Checking torrent: {0}", torrentTitle);
      const torrentId = element.children[1]
        .querySelector("a")!!
        .href.split("/")
        .pop();
      const token = JSON.parse(
        localStorage.getItem("ngStorage-token")!!
      ) as string;
      const data = await fetchAndParseJson(
        `https://tntracker.org/api/torrent?id=${torrentId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const imdbId = "tt" + data["imdb"];
      const size = data.size / 1024 / 1024;
      const category = parseCategory(data.category);
      let title;
      let year = undefined;
      let request: Request = {
        dom: [element as HTMLElement],
        category,
      };
      if (category == Category.MOVIE) {
        ({ title, year } = parseYearAndTitle(torrentTitle));
        request = {
          ...request,
          torrents: [
            {
              size,
              tags: parseTags(torrentTitle),
              dom: element as HTMLElement,
              resolution: parseResolution(torrentTitle),
              container: parseCodec(torrentTitle),
            },
          ],
          year,
          title: title?.replace(".", " "),
          imdbId,
        };
      } else if (category == Category.MUSIC) {
        const splittedTitle = torrentTitle.split("-")!!;
        const artists = [splittedTitle[0].replaceAll("_", " ")];
        const titles = [splittedTitle[1].replaceAll("_", " ")];
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
    return "TNT";
  }

  async search(request: Request): Promise<SearchResult> {
    return SearchResult.NOT_CHECKED;
  }

  async insertTrackersSelect(select: HTMLElement): Promise<void> {
    await sleep(3000);
    if (document.getElementById("find-unique-titles")) return;
    const form = document.getElementById("search")!!.parentElement;
    const wrapper = document.createElement("div");
    wrapper.classList.add("selector");
    wrapper.id = "find-unique-titles";
    addChild(wrapper, select);
    addChild(form as HTMLElement, wrapper);
  }
}
