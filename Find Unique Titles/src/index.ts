import {existsInCache, addToCache} from './utils/cache';

import * as trackers from './trackers';
import {tracker} from './trackers/tracker';
import {
  addCounter, showWaitingMessage,
  createTrackersSelect,
  updateCount,
  updateNewContent,
  updateTotalCount, hideMessageBox
} from './utils/dom';
import tracker_tools from 'common';

const main = async function () {
  'use strict';

  console.log('Init User script')
  /******************************************************************************/

  let only_show_unique_titles = true; // change to true if you wish
  let better_constant = 1.15; // you can change this too.. wouldn't recommend going below 1.05

  /******************************************************************************/
  if (document.getElementById('tracker-select')) return
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
  if (sourceTracker == null) return
  const select = createTrackersSelect(targetTrackers.map((tracker) => tracker.name()));
  select.addEventListener('change', async () => {
    let answer = confirm('Start searching new content for:  ' + select.value);
    if (answer) {
      const targetTracker = targetTrackers.find(
        (tracker) => tracker.name() === select.value
      ) as tracker;
      let i = 1
      let newContent = 0
      showWaitingMessage()
      let searchRequest = await (sourceTracker as tracker).getSearchRequest();
      hideMessageBox()
      addCounter();
      updateTotalCount(searchRequest.length)
      for await (const request of searchRequest) {
        updateCount(i++)
        if (request.imdbId && existsInCache(targetTracker.name(), request.imdbId)) {
          request.dom.style.display = 'none';
          continue
        }
        const response = await targetTracker.canUpload(request);
        if (!response) {
          if (request.imdbId) {
            await addToCache(targetTracker.name(), request.imdbId)
          }
          request.dom.style.display = 'none';
        } else {
          newContent++
          updateNewContent(newContent)
        }
      }
    }
  });
  (sourceTracker as tracker).insertTrackersSelect(select);
};

tracker_tools.dom.appendErrorMessage()
window.addEventListener('error', (event) => {
  tracker_tools.dom.showError(event.message)
})
window.onunhandledrejection = event => {
  console.trace(event.reason)
  tracker_tools.dom.showError(event.reason);
};
main()
  .catch((e) => {
    tracker_tools.dom.showError(e.message)
  });

let currentUrl = document.location.href;
const observer = new MutationObserver(async () => {
  if (document.location.href !== currentUrl) {
    await main()
  }
});

const config = {subtree: true, childList: true};
observer.observe(document, config);

window.addEventListener('beforeunload', function (event) {
  observer.disconnect();
});
