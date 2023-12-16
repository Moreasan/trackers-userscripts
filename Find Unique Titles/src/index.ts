import * as trackers from "./trackers";
import { MetaData, Request, SearchResult, tracker } from "./trackers/tracker";
import { addToCache, clearMemoryCache, existsInCache } from "./utils/cache";
import {
  addCounter,
  createTrackersSelect,
  updateCount,
  updateNewContent,
  updateTotalCount,
} from "./utils/dom";
import "./settings";
import { getSettings } from "./settings";
import { appendErrorMessage, showError } from "common/dom";
import { LEVEL, logger } from "common/logger";

function hideTorrents(request: Request) {
  for (let element of request.dom) {
    element.style.display = "none";
  }
  for (let torrent of request.torrents) {
    torrent.dom.style.display = "none";
  }
}

const setUpLogger = (debugMode: boolean) => {
  logger.setPrefix("[Find Unique Titles]");
  if (debugMode) {
    logger.setLevel(LEVEL.DEBUG);
  }
};

const main = async function () {
  "use strict";

  const settings = getSettings();

  setUpLogger(settings.debug);

  logger.info("Init User script");

  if (document.getElementById("tracker-select")) return;
  const url = window.location.href;
  let sourceTracker: tracker | null = null;
  let targetTrackers: Array<tracker> = [];
  Object.keys(trackers).forEach((trackerName) => {
    // @ts-expect-error
    const trackerImplementation: tracker = new trackers[trackerName]();
    if (trackerImplementation.canRun(url)) {
      sourceTracker = trackerImplementation;
    } else if (trackerImplementation.canBeUsedAsTarget()) {
      targetTrackers.push(trackerImplementation);
    }
  });
  if (sourceTracker == null) return;
  const select = createTrackersSelect(
    targetTrackers.map((tracker) => tracker.name())
  );
  select.addEventListener("change", async () => {
    let answer = confirm("Start searching new content for:  " + select.value);
    if (answer) {
      const targetTracker = targetTrackers.find(
        (tracker) => tracker.name() === select.value
      ) as tracker;
      let i = 1;
      let newContent = 0;
      let requestGenerator = (sourceTracker as tracker).getSearchRequest();
      const metadata = (await requestGenerator.next()).value as MetaData;
      addCounter();
      updateTotalCount(metadata.total);
      logger.debug(`[{0}] Parsing titles to check`, sourceTracker!!.name());
      for await (const item of requestGenerator) {
        if (item == null) {
          updateCount(i++);
          continue;
        }
        const request = item as Request;
        logger.debug(
          `[{0}] Search request: {1}`,
          sourceTracker!!.name(),
          request
        );
        try {
          if (
            settings.useCache &&
            request.imdbId &&
            existsInCache(targetTracker.name(), request.imdbId)
          ) {
            logger.debug("Title exists in target tracker, found using cache");
            hideTorrents(request);
            updateCount(i++);
            continue;
          }
          const response = await targetTracker.search(request);
          logger.debug("Search response: {0}", response)
          if (
            response == SearchResult.EXIST ||
            response == SearchResult.NOT_ALLOWED
          ) {
            if (request.imdbId) {
              await addToCache(targetTracker.name(), request.imdbId);
            }
            hideTorrents(request);
          } else if (response == SearchResult.NOT_LOGGED_IN) {
            alert(`You are not logged in ${targetTracker.name()}`);
            break;
          } else {
            newContent++;
            updateNewContent(newContent);
            if (response == SearchResult.MAYBE_NOT_EXIST) {
              request.dom[0].setAttribute(
                "title",
                "Title may not exist on target tracker"
              );
              request.dom[0].style.border = "2px solid #9b59b6";
            } else if (response == SearchResult.NOT_EXIST_WITH_REQUEST) {
              request.dom[0].setAttribute(
                "title",
                "Title was not found and has matching requests"
              );
              request.dom[0].style.border = "2px solid #2ecc71";
            } else if (response == SearchResult.MAYBE_NOT_EXIST_WITH_REQUEST) {
              request.dom[0].setAttribute(
                "title",
                "Title may not exists and there are matching requests"
              );
              request.dom[0].style.border = "2px solid #e67e22";
            } else if (response == SearchResult.NOT_CHECKED) {
              request.dom[0].setAttribute(
                "title",
                "Title was not checked on target tracker"
              );
              request.dom[0].style.border = "2px solid #e74c3c";
            } else if (response == SearchResult.NOT_EXIST) {
              request.dom[0].setAttribute(
                "title",
                "Title was not found on target tracker"
              );
              request.dom[0].style.border = "2px solid #3498db";
            } else if (response == SearchResult.EXIST_BUT_MISSING_SLOT) {
              request.dom[0].setAttribute(
                "title",
                "Title exists but there is an available slot on target tracker"
              );
              request.dom[0].style.border = "2px solid #ff00ff";
            }
          }
        } catch (e) {
          console.trace("Error occurred: ", e)
          logger.info("Error occurred when checking {0}, {1]", request, e);
          request.dom[0].setAttribute(
            "title",
            "Title was not checked due to an error"
          );
          request.dom[0].style.border = "2px solid red";
        } finally {
          updateCount(i++);
        }
      }
      clearMemoryCache();
    }
  });
  (sourceTracker as tracker).insertTrackersSelect(select);
};

appendErrorMessage();
main().catch((e) => {
  showError(e.message);
});

let currentUrl = document.location.href;
const observer = new MutationObserver(async () => {
  if (document.location.href !== currentUrl) {
    await main();
  }
});

const config = { subtree: true, childList: true };
observer.observe(document, config);

window.addEventListener("beforeunload", function () {
  observer.disconnect();
});
