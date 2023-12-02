import * as trackers from "./trackers";
import { tracker, Request, MetaData } from "./trackers/tracker";
import { existsInCache, addToCache, clearMemoryCache } from "./utils/cache";
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

function hideTorrents(request: Request) {
  for (let element of request.dom) {
    element.style.display = "none";
  }
  for (let torrent of request.torrents) {
    torrent.dom.style.display = "none";
  }
}

const main = async function () {
  "use strict";

  console.log("Init User script");
  /******************************************************************************/
  const settings = getSettings();

  /******************************************************************************/
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
      for await (const item of requestGenerator) {
        const request = item as Request;
        if (
          settings.useCache &&
          request.imdbId &&
          existsInCache(targetTracker.name(), request.imdbId)
        ) {
          hideTorrents(request);
          updateCount(i++);
          continue;
        }
        const response = await targetTracker.canUpload(
          request,
          settings.onlyNewTitles
        );
        updateCount(i++);
        if (!response) {
          if (request.imdbId) {
            await addToCache(targetTracker.name(), request.imdbId);
          }
          hideTorrents(request);
        } else {
          newContent++;
          updateNewContent(newContent);
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
