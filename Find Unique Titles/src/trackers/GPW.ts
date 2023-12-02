import { parseImdbIdFromLink, parseSize } from "../utils/utils";
import { MetaData, Request, toGenerator, Torrent, tracker } from "./tracker";
import { addChild } from "common/dom";
import { fetchAndParseHtml } from "common/http";

export default class GPW implements tracker {
  canBeUsedAsSource(): boolean {
    return true;
  }

  canBeUsedAsTarget(): boolean {
    return true;
  }

  canRun(url: string): boolean {
    return url.includes("greatposterwall.com");
  }

async *getSearchRequest(): AsyncGenerator<MetaData | Request, void, void> {
    const requests: Array<Request> = [];
    document
      .querySelectorAll("#torrent_table tr.TableTorrent-rowMovieInfo")
      .forEach((element: HTMLElement) => {
        let imdbId = parseImdbIdFromLink(element);
        const groupId = element.getAttribute("group-id");
        const torrents: Array<Torrent> = [];
        if (groupId) {
          const torrentElements = document.querySelectorAll(
            `tr.TableTorrent-rowTitle[group-id="${groupId}"]`
          );
          for (const torrentElement of torrentElements) {
            const torrentTtitle =
              torrentElement.querySelector("span.TorrentTitle").textContent;
            const tags = [];
            if (torrentTtitle.includes("Remux")) {
              tags.push("Remux");
            }
            let container = undefined;
            const containerElement = torrentElement.querySelector(
              "span.TorrentTitle-item.codec"
            );
            if (containerElement) {
              container = containerElement.textContent.trim();
            }
            const torrent: Torrent = {
              container,
              dom: torrentElement,
              format: "",
              resolution: torrentElement
                .querySelector("span.TorrentTitle-item.resolution")
                .textContent.trim(),
              size: parseSize(
                torrentElement.querySelector("td.TableTorrent-cellStatSize").textContent
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
        requests.push(request);
      });

    yield* toGenerator(requests)
  }

  name(): string {
    return "GPW";
  }

  async canUpload(request: Request) {
    if (!request.imdbId) return true;
    const queryUrl = `https://greatposterwall.com/torrents.php?groupname=${request.imdbId}`;

    const result = await fetchAndParseHtml(queryUrl);

    return result.querySelector(".torrent-listings-no-result") !== null;
  }

  insertTrackersSelect(select: HTMLElement): void {
    select.classList.add('Input')
    addChild(
      document.querySelector(".SearchPageFooter-actions"),
      select
    );
  }
}
