import {
  parseImdbIdFromLink,
  parseResolution,
  parseSize,
} from "../utils/utils";
import {
  MetaData,
  Request,
  SearchResult,
  Torrent,
  AbstractTracker,
} from "./tracker";
import { addChild } from "common/dom";
import { fetchAndParseHtml } from "common/http";

export default class GPW extends AbstractTracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("greatposterwall.com") && !url.includes("id=");
  }

  async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const elements = document.querySelectorAll(
      "#torrent_table tr.TableTorrent-rowMovieInfo"
    );
    yield {
      total: elements.length,
    };
    for (let element of Array.from(elements)) {
      let imdbId = parseImdbIdFromLink(element);
      const groupId = element.getAttribute("group-id");
      const torrents: Array<Torrent> = [];
      if (groupId) {
        const torrentElements = document.querySelectorAll(
          `tr.TableTorrent-rowTitle[group-id="${groupId}"]`
        );
        for (const torrentElement of Array.from(torrentElements)) {
          const torrentTtitle =
            torrentElement.querySelector("span.TorrentTitle")?.textContent;
          const tags = [];
          if (torrentTtitle?.includes("Remux")) {
            tags.push("Remux");
          }
          let container = undefined;
          const containerElement = torrentElement.querySelector(
            "span.TorrentTitle-item.codec"
          );
          if (containerElement) {
            container = containerElement?.textContent?.trim();
          }
          const torrent: Torrent = {
            container,
            dom: torrentElement,
            format: "",
            resolution: parseResolution(
              torrentElement
                .querySelector("span.TorrentTitle-item.resolution")
                ?.textContent?.trim()
            ),
            size: parseSize(
              torrentElement.querySelector("td.TableTorrent-cellStatSize")
                ?.textContent
            ),
            tags,
          };
          torrents.push(torrent);
        }
      }

      const request: Request = {
        torrents,
        dom: [element],
        imdbId,
        title: "",
      };
      yield request;
    }
  }

  name(): string {
    return "GPW";
  }

  async search(request: Request): Promise<SearchResult> {
    if (!request.imdbId) return SearchResult.NOT_CHECKED;
    const queryUrl = `https://greatposterwall.com/torrents.php?groupname=${request.imdbId}`;

    const result = await fetchAndParseHtml(queryUrl);

    return result.querySelector(".torrent-listings-no-result") !== null
      ? SearchResult.NOT_EXIST
      : SearchResult.EXIST;
  }

  insertTrackersSelect(select: HTMLElement): void {
    select.classList.add("Input");
    addChild(document.querySelector(".SearchPageFooter-actions")!!, select);
  }
}
