import {
  addToCache,
  addToMemoryCache,
  getFromMemoryCache,
} from "../utils/cache";
import { parseSize } from "../utils/utils";
import { Category, MetaData, Request, Torrent, tracker } from "./tracker";
import tracker_tools from "common";

function isSupportedCategory(category: Category) {
  return (
    category === undefined ||
    category === Category.MOVIE ||
    category === Category.DOCUMENTARY ||
    category === Category.LIVE_PERFORMANCE
  );
}

export default class PTP implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("passthepopcorn.me");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    yield {
      total: 0,
    };
  }

  name(): string {
    return "PTP";
  }

  async canUpload(request: Request, onlyNew: boolean): Promise<boolean> {
    if (!isSupportedCategory(request.category)) return false;
    if (!request.imdbId) return true;
    let torrents = getFromMemoryCache(request.imdbId);
    if (!torrents) {
      const query_url =
        "https://passthepopcorn.me/torrents.php?imdb=" + request.imdbId;
      const result = await tracker_tools.http.fetchAndParseHtml(query_url);
      torrents = parseAvailableTorrents(result);
      addToMemoryCache(request.imdbId, torrents);
    }
    let notFound = !torrents.length;
    if (notFound) {
      return true;
    }
    if (onlyNew) {
      return false;
    }
    for (let torrent of request.torrents) {
      if (canUploadTorrent(torrent, torrents)) {
        torrent.dom.style.border = "2px solid red";
        notFound = true;
      } else {
        torrent.dom.style.display = "none";
      }
    }
    return notFound;
  }

  insertTrackersSelect(select: HTMLSelectElement): void {
    let element = document.querySelector(".search-form__footer__buttons");
    if (!element) return;
    tracker_tools.dom.insertBefore(select, element as HTMLElement);
  }
}

const parseAvailableTorrents = (result: HTMLElement): Array<Torrent> => {
  const torrents = [];
  result
    .querySelectorAll('#torrent-table tr[id^="group_torrent_header_"]')
    .forEach((line) => {
      const data = line.children[0].textContent.trim().split("/");
      const size = parseSize(line.children[1].textContent.trim());
      const tags = [];
      if (line.textContent.includes("Remux")) {
        tags.push("Remux");
      }
      const torrent: Torrent = {
        container: data[0].split("]")[1].trim(),
        format: data[1].trim(),
        resolution: data[3].trim(),
        tags: tags,
        size,
        dom: line as HTMLElement,
      };
      torrents.push(torrent);
    });
  return torrents;
};

function sameContainer(first: string, second: string) {
  return (
    first === second ||
    (first === "H.264" && second === "x264") ||
    (first === "x264" && second === "H.264") ||
    (first === "H.265" && second === "x265") ||
    (first === "x265" && second === "H.265") ||
    (first === "UHD100" && second === "BD100") ||
    (first === "BD100" && second === "UHD100") ||
    (first === "UHD66" && second === "BD66") ||
    (first === "BD66" && second === "UHD66")
  );
}

function isSD(resolution: string) {
  const sdResolutions = ["SD", "PAL", "NTSC"];
  if (sdResolutions.indexOf(resolution.toUpperCase())) return true;
  let height = resolution.replace("p", "");
  if (resolution.includes("x")) {
    height = resolution.split("x")[1];
  }
  if (parseInt(height) && parseInt(height) < 720) return true;
}

function sameResolution(first: Torrent, second: Torrent) {
  if (!first.resolution || !second.resolution) return true;
  if (first.resolution === second.resolution) return true;
  if (first.resolution === "SD") return isSD(second.resolution);
  if (second.resolution === "SD") return isSD(first.resolution);
}

const canUploadTorrent = (
  torrent: Torrent,
  availableTorrents: Array<Torrent>
) => {
  const similarTorrents = availableTorrents.filter((e) => {
    return (
      sameResolution(torrent, e) &&
      (torrent.container === undefined ||
        sameContainer(e.container, torrent.container)) &&
      (!torrent.tags.includes("Remux") || e.tags.includes("Remux"))
    );
  });
  if (similarTorrents.length == 0 && torrent.resolution && torrent.container) {
    return true;
  }
  if (similarTorrents.length == 1) {
    if (
      torrent.size > similarTorrents[0].size * 1.5 ||
      similarTorrents[0].size > torrent.size * 1.5
    ) {
      return true;
    }
  }
  return false;
};
