// ==UserScript==
// @name Find Unique Titles
// @description Find unique titles to cross seed
// @version 0.0.5
// @author Mea01
// @match https://cinemageddon.net/browse.php*
// @match https://karagarga.in/browse.php*
// @match https://hdbits.org/browse.php*
// @match https://passthepopcorn.me/torrents.php*
// @match https://passthepopcorn.me/torrents.php?type=seeding
// @match https://beyond-hd.me/library/movies*
// @match https://beyond-hd.me/torrents*
// @match https://cinemaz.to/movies*
// @match https://avistaz.to/movies*
// @match https://blutopia.xyz/torrents*
// @match https://blutopia.cc/torrents*
// @match https://aither.cc/torrents*
// @match https://www.torrentleech.org/torrents/browse*
// @match https://secret-cinema.pw/torrents.php*
// @match https://www.clan-sudamerica.net/invision/*
// @match https://newinsane.info/browse.php*
// @match https://btarg.com.ar/tracker/browse.php*
// @match https://filelist.io/browse.php*
// @match https://jptv.club/torrents*
// @match https://hd-torrents.org/torrents.php*
// @match https://iptorrents.com/movies*
// @match https://kp.m-team.cc/*
// @match https://ncore.pro/torrents.php*
// @match https://greatposterwall.com/torrents.php*
// @match https://ptchdbits.co/torrents.php*
// @match https://hdsky.me/torrents.php*
// @match https://www.cinematik.net/browse.php*
// @match https://pterclub.com/torrents.php*
// @match https://pterc.com/torrents.php*
// @match https://torrentseeds.org/torrents*
// @match https://torrentseeds.org/categories/*
// @grant GM.xmlHttpRequest
// @grant GM.setValue
// @grant GM.getValue
// @grant GM_registerMenuCommand
// @namespace http://tampermonkey.net/
// @require https://cdn.jsdelivr.net/npm/jquery@^3.6.4/dist/jquery.min.js
// @require https://openuserjs.org/src/libs/sizzle/GM_config.js
// @updateURL https://github.com/Moreasan/trackers-userscripts/blob/master/Find%20Unique%20Titles/dist/find.unique.titles.user.js
// ==/UserScript==

(() => {
  "use strict";
  var __webpack_modules__ = {
    "./src/index.ts": (module, __unused_webpack___webpack_exports__, __webpack_require__) => {
      __webpack_require__.a(module, (async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
        try {
          var _trackers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/trackers/index.ts");
          var _utils_cache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/utils/cache.ts");
          var _utils_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/utils/dom.ts");
          var _settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/settings.ts");
          var common_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../common/dist/dom/index.mjs");
          var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([ _trackers__WEBPACK_IMPORTED_MODULE_1__, _utils_cache__WEBPACK_IMPORTED_MODULE_3__ ]);
          [_trackers__WEBPACK_IMPORTED_MODULE_1__, _utils_cache__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
          function hideTorrents(request) {
            request.dom.style.display = "none";
            for (let torrent of request.torrents) torrent.dom.style.display = "none";
          }
          const main = async function() {
            console.log("Init User script");
            const settings = (0, _settings__WEBPACK_IMPORTED_MODULE_0__.getSettings)();
            if (document.getElementById("tracker-select")) return;
            const url = window.location.href;
            let sourceTracker = null;
            let targetTrackers = [];
            Object.keys(_trackers__WEBPACK_IMPORTED_MODULE_1__).forEach((trackerName => {
              const trackerImplementation = new _trackers__WEBPACK_IMPORTED_MODULE_1__[trackerName];
              if (trackerImplementation.canRun(url)) sourceTracker = trackerImplementation; else if (trackerImplementation.canBeUsedAsTarget()) targetTrackers.push(trackerImplementation);
            }));
            if (null == sourceTracker) return;
            const select = (0, _utils_dom__WEBPACK_IMPORTED_MODULE_2__.createTrackersSelect)(targetTrackers.map((tracker => tracker.name())));
            select.addEventListener("change", (async () => {
              let answer = confirm("Start searching new content for:  " + select.value);
              if (answer) {
                const targetTracker = targetTrackers.find((tracker => tracker.name() === select.value));
                let i = 1;
                let newContent = 0;
                let requestGenerator = sourceTracker.getSearchRequest();
                const metadata = (await requestGenerator.next()).value;
                (0, _utils_dom__WEBPACK_IMPORTED_MODULE_2__.addCounter)();
                (0, _utils_dom__WEBPACK_IMPORTED_MODULE_2__.updateTotalCount)(metadata.total);
                for await (const item of requestGenerator) {
                  const request = item;
                  if (settings.useCache && request.imdbId && (0, _utils_cache__WEBPACK_IMPORTED_MODULE_3__.existsInCache)(targetTracker.name(), request.imdbId)) {
                    hideTorrents(request);
                    (0, _utils_dom__WEBPACK_IMPORTED_MODULE_2__.updateCount)(i++);
                    continue;
                  }
                  const response = await targetTracker.canUpload(request, settings.onlyNewTitles);
                  (0, _utils_dom__WEBPACK_IMPORTED_MODULE_2__.updateCount)(i++);
                  if (!response) {
                    if (request.imdbId) await (0, _utils_cache__WEBPACK_IMPORTED_MODULE_3__.addToCache)(targetTracker.name(), request.imdbId);
                    hideTorrents(request);
                  } else {
                    newContent++;
                    (0, _utils_dom__WEBPACK_IMPORTED_MODULE_2__.updateNewContent)(newContent);
                  }
                }
                (0, _utils_cache__WEBPACK_IMPORTED_MODULE_3__.clearMemoryCache)();
              }
            }));
            sourceTracker.insertTrackersSelect(select);
          };
          (0, common_dom__WEBPACK_IMPORTED_MODULE_4__.appendErrorMessage)();
          main().catch((e => {
            (0, common_dom__WEBPACK_IMPORTED_MODULE_4__.showError)(e.message);
          }));
          let currentUrl = document.location.href;
          const observer = new MutationObserver((async () => {
            if (document.location.href !== currentUrl) await main();
          }));
          const config = {
            subtree: true,
            childList: true
          };
          observer.observe(document, config);
          window.addEventListener("beforeunload", (function() {
            observer.disconnect();
          }));
          __webpack_async_result__();
        } catch (e) {
          __webpack_async_result__(e);
        }
      }));
    },
    "./src/settings.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        getSettings: () => getSettings
      });
      const defaultConfig = {
        onlyNewTitles: false,
        useCache: true,
        sizeDifferenceThreshold: 1.2
      };
      GM_config.init({
        id: "find-unique-titles-settings",
        title: "Find Unique Titles",
        fields: {
          onlyNewTitles: {
            label: "Only new titles",
            type: "checkbox",
            default: defaultConfig.onlyNewTitles
          },
          useCache: {
            label: "Use cache",
            type: "checkbox",
            default: defaultConfig.useCache
          },
          sizeDifferenceThreshold: {
            label: "Size Difference Threshold",
            type: "float",
            default: defaultConfig.sizeDifferenceThreshold
          }
        },
        css: "\n        #find-unique-titles-settings {\n        }\n        #find-unique-titles-settings .config_var {\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n        }\n    ",
        events: {
          open: function() {
            GM_config.frame.style.width = "400px";
            GM_config.frame.style.height = "250px";
            GM_config.frame.style.position = "fixed";
            GM_config.frame.style.left = "50%";
            GM_config.frame.style.top = "50%";
            GM_config.frame.style.transform = "translate(-50%, -50%)";
          },
          save: function() {
            GM_config.close();
          }
        }
      });
      GM_registerMenuCommand("Settings", (() => GM_config.open()));
      const getSettings = () => ({
        onlyNewTitles: GM_config.get("onlyNewTitles"),
        useCache: GM_config.get("useCache"),
        sizeDifferenceThreshold: GM_config.get("sizeDifferenceThreshold")
      });
    },
    "./src/trackers/Aither.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => Aither
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/http/index.mjs");
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/dist/dom/index.mjs");
      class Aither {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return true;
        }
        canRun(url) {
          return url.includes("aither.cc");
        }
        async* getSearchRequest() {
          const requests = [];
          document.querySelectorAll(".panelV2 tbody tr").forEach((element => {
            let imdbId = element.querySelector("#imdb_id")?.textContent.trim();
            let size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(element.children[5].textContent);
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element
              } ],
              dom: element,
              imdbId,
              query: ""
            };
            requests.push(request);
          }));
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.toGenerator)(requests);
        }
        name() {
          return "Aither";
        }
        async canUpload(request) {
          if (!request.imdbId) return true;
          const queryUrl = "https://aither.xyz/torrents?perPage=25&imdbId=" + request.imdbId + "&sortField=size";
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.fetchAndParseHtml)(queryUrl);
          return result.textContent.includes("There is no result in database for query");
        }
        insertTrackersSelect(select) {
          const parent = document.querySelector(".panelV2 .panel__header");
          const div = document.createElement("div");
          select.style.width = "170px";
          div.classList.add("form__group");
          select.classList.add("form__select");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.addChild)(div, select);
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.insertAfter)(div, parent.querySelector("h2"));
        }
      }
    },
    "./src/trackers/AvistaZ.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => AvistaZ
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/dist/dom/index.mjs");
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/http/index.mjs");
      class AvistaZ {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return true;
        }
        canRun(url) {
          return url.includes("avistaz.to");
        }
        async* getSearchRequest() {
          const requests = [];
          document.querySelectorAll("#content-area > div.block > .row")?.forEach((element => {
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element);
            const request = {
              torrents: [],
              dom: element,
              imdbId,
              query: ""
            };
            requests.push(request);
          }));
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.toGenerator)(requests);
        }
        name() {
          return "AvistaZ";
        }
        async canUpload(request) {
          if (!request.imdbId) return true;
          const queryUrl = "https://avistaz.to/movies?search=&imdb=" + request.imdbId;
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.fetchAndParseHtml)(queryUrl);
          return result.textContent?.includes("No Movie found!");
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.addChild)(document.querySelector("#content-area > div.well.well-sm"), select);
        }
      }
    },
    "./src/trackers/BHD.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => BHD
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/dist/dom/index.mjs");
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/http/index.mjs");
      const parseTorrents = element => {
        const torrents = [];
        element.querySelectorAll('tr[id^="resulttorrent"]').forEach((torrentElement => {
          const data = torrentElement.children[0].textContent.trim().split("/");
          const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(torrentElement.children[4].textContent.trim());
          const tags = [];
          if (torrentElement.textContent.includes("Remux")) tags.push("Remux");
          const torrent = {
            container: data[0].trim(),
            format: data[1].trim(),
            resolution: data[3].trim(),
            tags,
            size,
            dom: torrentElement
          };
          torrents.push(torrent);
        }));
        return torrents;
      };
      const parseCategory = element => {
        const html = element.children[0].innerHTML;
        if (html.includes("categories/tv")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.TV; else if (html.includes("categories/movies")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.MOVIE;
        return;
      };
      const parseTorrentsFromTorrentsPage = () => {
        const requests = [];
        document.querySelectorAll('tr[id^="torrentposter"]').forEach((element => {
          let imdbId = null;
          let libraryId = element.getAttribute("library");
          if (libraryId) {
            let imdbElement = document.querySelector(`#librarydiv${libraryId}`);
            if (imdbElement) imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(imdbElement);
          }
          const tags = [];
          const torrentName = element.children[1].querySelector('a[id^="torrent"]').textContent;
          if (torrentName.toUpperCase().includes("REMUX")) tags.push("Remux");
          const torrent = {
            dom: element,
            size: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(element.children[5].textContent),
            tags,
            resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseResolution)(torrentName)
          };
          const torrents = [ torrent ];
          const request = {
            torrents,
            dom: element,
            imdbId,
            query: "",
            category: parseCategory(element)
          };
          requests.push(request);
        }));
        return requests;
      };
      const parseTorrentsFromMoviesPage = () => {
        const requests = [];
        document.querySelectorAll(".bhd-meta-box").forEach((element => {
          let imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element);
          const request = {
            torrents: parseTorrents(element),
            dom: element,
            imdbId,
            query: ""
          };
          requests.push(request);
        }));
        return requests;
      };
      const isMoviesPage = () => window.location.href.includes("/movies");
      const isTorrentsPage = () => window.location.href.includes("/torrents");
      class BHD {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return true;
        }
        canRun(url) {
          return url.includes("beyond-hd.me");
        }
        async* getSearchRequest() {
          let requests = [];
          if (isMoviesPage()) requests = parseTorrentsFromMoviesPage(); else if (isTorrentsPage()) requests = parseTorrentsFromTorrentsPage();
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.toGenerator)(requests);
        }
        name() {
          return "BHD";
        }
        async canUpload(request) {
          if (!request.imdbId) return true;
          const queryUrl = "https://beyond-hd.me/library/movies?activity=&q=" + request.imdbId;
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.fetchAndParseHtml)(queryUrl);
          return 0 === result.querySelectorAll(".bhd-meta-box").length;
        }
        insertTrackersSelect(select) {
          select.classList.add("beta-form-main");
          select.style.width = "170px";
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.insertBefore)(select, document.querySelector(".button-center"));
        }
      }
    },
    "./src/trackers/BLU.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => BLU
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/http/index.mjs");
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/dist/dom/index.mjs");
      class BLU {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return true;
        }
        canRun(url) {
          return url.includes("blutopia.xyz") || url.includes("blutopia.cc");
        }
        async* getSearchRequest() {
          const requests = [];
          document.querySelectorAll(".torrent-search--list__results tbody tr").forEach((element => {
            let imdbId = "tt" + element.getAttribute("data-imdb-id");
            let size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(element.querySelector(".torrent-search--list__size").textContent);
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element
              } ],
              dom: element,
              imdbId,
              query: ""
            };
            requests.push(request);
          }));
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.toGenerator)(requests);
        }
        name() {
          return "BLU";
        }
        async canUpload(request) {
          if (!request.imdbId) return true;
          const queryUrl = "https://blutopia.xyz/torrents?perPage=25&imdbId=" + request.imdbId + "&sortField=size";
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.fetchAndParseHtml)(queryUrl);
          return null !== result.querySelector(".torrent-listings-no-result");
        }
        insertTrackersSelect(select) {
          select.classList.add("form__select");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.addChild)(document.querySelectorAll(".panel__actions")[1], select);
        }
      }
    },
    "./src/trackers/BTarg.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => BTarg
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/utils/utils.ts");
      var common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/dist/http/index.mjs");
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/dom/index.mjs");
      class BTarg {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return false;
        }
        canRun(url) {
          return url.includes("https://btarg.com.ar");
        }
        async* getSearchRequest() {
          const rows = document.querySelectorAll("tr.browsetable");
          yield {
            total: rows.length
          };
          for (const row of rows) {
            const link = row.querySelector('a[href*="details.php?id"]');
            if (!link) continue;
            if (link.href.includes("#")) continue;
            let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_0__.fetchAndParseHtml)(link.href);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseImdbId)(response.textContent);
            const request = {
              torrents: [],
              dom: row,
              imdbId,
              query: ""
            };
            yield request;
          }
        }
        name() {
          return "BTarg";
        }
        async canUpload(request) {
          return false;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.insertAfter)(select, document.querySelector('select[name="inclfree"]'));
        }
      }
    },
    "./src/trackers/CG.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => CG
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/http/index.mjs");
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/dist/dom/index.mjs");
      const parseCategory = element => {
        const text = element.textContent.toLowerCase();
        if (text.includes("ebook")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.Category.BOOK;
        return _tracker__WEBPACK_IMPORTED_MODULE_0__.Category.MOVIE;
      };
      function parseTorrents(element) {
        const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseSize)(element.querySelector("td:nth-child(5)")?.textContent);
        let container;
        let format;
        let resolution = "SD";
        const text = element.textContent.toLowerCase();
        if (text.includes("1080p")) resolution = "1080p"; else if (text.includes("720p")) resolution = "720p"; else if (text.includes("dvd-r")) format = "VOB IFO";
        return [ {
          size,
          tags: [],
          dom: element,
          resolution,
          container,
          format
        } ];
      }
      class CG {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return true;
        }
        canRun(url) {
          return url.includes("cinemageddon.net");
        }
        async* getSearchRequest() {
          const requests = [];
          document.querySelectorAll("table.torrenttable tbody tr")?.forEach((element => {
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseImdbIdFromLink)(element);
            const category = parseCategory(element);
            const request = {
              torrents: parseTorrents(element),
              dom: element,
              imdbId,
              query: "",
              category
            };
            requests.push(request);
          }));
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_0__.toGenerator)(requests);
        }
        name() {
          return "CG";
        }
        async canUpload(request) {
          if (!request.imdbId) return true;
          const queryUrl = "https://cinemageddon.net/browse.php?search=" + request.imdbId + "&orderby=size&dir=DESC";
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.fetchAndParseHtml)(queryUrl);
          return result.textContent?.includes("Nothing found!");
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.addChild)(document.querySelector(".embedded > p"), select);
        }
      }
    },
    "./src/trackers/CHD.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => CHD
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/utils/utils.ts");
      var common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/dist/http/index.mjs");
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/dom/index.mjs");
      class CHD {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return false;
        }
        canRun(url) {
          return url.includes("ptchdbits.co");
        }
        async* getSearchRequest() {
          let nodes = document.querySelectorAll(".torrents")[0].children[0].children;
          yield {
            total: nodes.length
          };
          for (const element of nodes) {
            if (!element.querySelector(".torrentname")) continue;
            const link = element.querySelector('a[href*="details.php?id"]');
            if (!link) continue;
            let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_0__.fetchAndParseHtml)(link.href);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseImdbIdFromLink)(response);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseSize)(element.querySelector(".rowfollow:nth-child(5)").innerText);
            console.log("size:", size);
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element
              } ],
              dom: element,
              imdbId,
              query: ""
            };
            yield request;
          }
        }
        name() {
          return "CHD";
        }
        async canUpload(request) {
          return false;
        }
        insertTrackersSelect(select) {
          const element = document.querySelector(".searchbox").children[2].querySelector("td td.rowfollow tr");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.addChild)(element, select);
        }
      }
    },
    "./src/trackers/CLAN-SUD.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => CLANSUD
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/utils/utils.ts");
      var common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/dist/http/index.mjs");
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/dom/index.mjs");
      class CLANSUD {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return false;
        }
        canRun(url) {
          return url.includes("www.clan-sudamerica.net/invision/") && !url.includes("forums/topic/");
        }
        async* getSearchRequest() {
          const topics = document.querySelectorAll('div[data-tableid="topics"] table');
          yield {
            total: topics.length
          };
          for (const topic of topics) {
            if (null != topic.getAttribute("bgColor") && null != !topic.getAttribute("bgcolor")) continue;
            if (0 === topic.querySelectorAll("img").length) continue;
            if (3 != topic.querySelectorAll("img").length) continue;
            if ("peliscr.jpg" !== topic.querySelectorAll("img")[2].alt) {
              topic.style.display = "none";
              continue;
            }
            const link = topic.querySelector("a").href;
            let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_0__.fetchAndParseHtml)(link);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseImdbIdFromLink)(response);
            const request = {
              torrents: [],
              dom: topic,
              imdbId,
              query: ""
            };
            yield request;
          }
        }
        name() {
          return "CLAN-SUD";
        }
        async canUpload(request) {
          return false;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.insertBefore)(select, document.querySelector('div[data-tableid="topics"]'));
        }
      }
    },
    "./src/trackers/CinemaZ.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => CinemaZ
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/http/index.mjs");
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/dist/dom/index.mjs");
      class CinemaZ {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return true;
        }
        canRun(url) {
          return url.includes("cinemaz.to");
        }
        async* getSearchRequest() {
          const requests = [];
          document.querySelectorAll("#content-area > div.block > .row")?.forEach((element => {
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element);
            const request = {
              torrents: [],
              dom: element,
              imdbId,
              query: ""
            };
            requests.push(request);
          }));
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.toGenerator)(requests);
        }
        name() {
          return "CinemaZ";
        }
        async canUpload(request) {
          if (!request.imdbId) return true;
          const queryUrl = "https://cinemaz.to/movies?search=&imdb=" + request.imdbId;
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.fetchAndParseHtml)(queryUrl);
          return result.textContent?.includes("No Movie found!");
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.addChild)(document.querySelector("#content-area > div.well.well-sm"), select);
        }
      }
    },
    "./src/trackers/FL.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => FL
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/utils/utils.ts");
      var common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/dist/http/index.mjs");
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/dom/index.mjs");
      class FL {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return true;
        }
        canRun(url) {
          return url.includes("filelist.io");
        }
        async* getSearchRequest() {
          let nodes = document.querySelectorAll(".torrentrow");
          yield {
            total: nodes.length
          };
          for (const element of nodes) {
            const link = element.querySelector('a[href*="details.php?id"]');
            if (!link) continue;
            let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_0__.fetchAndParseHtml)(link.href);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseImdbIdFromLink)(response);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseSize)(element.querySelector(".torrenttable:nth-child(7)")?.textContent);
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element
              } ],
              dom: element,
              imdbId,
              query: ""
            };
            yield request;
          }
        }
        name() {
          return "FL";
        }
        async canUpload(request) {
          if (!request.imdbId) return true;
          const queryUrl = "https://filelist.io/browse.php?search=" + request.imdbId + "&cat=0&searchin=1&sort=3";
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_0__.fetchAndParseHtml)(queryUrl);
          return 0 === result.querySelectorAll(".torrentrow").length;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.addChild)(document.querySelector("form p"), select);
        }
      }
    },
    "./src/trackers/GPW.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => GPW
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/dist/dom/index.mjs");
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/http/index.mjs");
      class GPW {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return true;
        }
        canRun(url) {
          return url.includes("greatposterwall.com");
        }
        async* getSearchRequest() {
          const requests = [];
          document.querySelectorAll("#torrent_table tr.TableTorrent-rowMovieInfo").forEach((element => {
            let imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element);
            const groupId = element.getAttribute("group-id");
            const torrents = [];
            if (groupId) {
              const torrentElements = document.querySelectorAll(`tr.TableTorrent-rowTitle[group-id="${groupId}"]`);
              for (const torrentElement of torrentElements) {
                const torrentTtitle = torrentElement.querySelector("span.TorrentTitle").textContent;
                const tags = [];
                if (torrentTtitle.includes("Remux")) tags.push("Remux");
                let container;
                const containerElement = torrentElement.querySelector("span.TorrentTitle-item.codec");
                if (containerElement) container = containerElement.textContent.trim();
                const torrent = {
                  container,
                  dom: torrentElement,
                  format: "",
                  resolution: torrentElement.querySelector("span.TorrentTitle-item.resolution").textContent.trim(),
                  size: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(torrentElement.querySelector("td.TableTorrent-cellStatSize").textContent),
                  tags
                };
                torrents.push(torrent);
              }
            }
            const request = {
              torrents,
              dom: element,
              imdbId,
              query: ""
            };
            requests.push(request);
          }));
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.toGenerator)(requests);
        }
        name() {
          return "GPW";
        }
        async canUpload(request) {
          if (!request.imdbId) return true;
          const queryUrl = `https://greatposterwall.com/torrents.php?groupname=${request.imdbId}`;
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.fetchAndParseHtml)(queryUrl);
          return null !== result.querySelector(".torrent-listings-no-result");
        }
        insertTrackersSelect(select) {
          select.classList.add("Input");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.addChild)(document.querySelector(".SearchPageFooter-actions"), select);
        }
      }
    },
    "./src/trackers/HDB.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => HDB
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/http/index.mjs");
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/dist/dom/index.mjs");
      const isExclusive = element => {
        const exclusiveLink = element.querySelector('a[href="/browse.php?exclusive=1"]');
        return null != exclusiveLink;
      };
      function parseTorrent(element) {
        const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(element.querySelector("td:nth-child(6)")?.textContent);
        const title = element.querySelector(".browse_td_name_cell a").textContent.trim();
        const resolution = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseResolution)(title);
        const tags = [];
        if (element.querySelector("#codec1 .medium5")) tags.push("Remux");
        return {
          size,
          tags,
          dom: element,
          resolution
        };
      }
      function parseCategory(element) {
        const category = element.querySelector(".catcell a").getAttribute("href").replace("?cat=", "");
        switch (category) {
         case "1":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.MOVIE;

         case "2":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.TV;

         case "3":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.DOCUMENTARY;

         case "4":
         case "6":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.MUSIC;

         case "5":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.SPORT;

         case "7":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.XXX;
        }
      }
      class HDB {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return true;
        }
        canRun(url) {
          return url.includes("hdbits.org");
        }
        async* getSearchRequest() {
          const requests = [];
          document.querySelectorAll("#torrent-list > tbody tr")?.forEach((element => {
            if (isExclusive(element)) {
              element.style.display = "none";
              return;
            }
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbId)(element.querySelector("a[data-imdb-link]")?.getAttribute("data-imdb-link"));
            const request = {
              torrents: [ parseTorrent(element) ],
              dom: element,
              imdbId,
              query: "",
              category: parseCategory(element)
            };
            requests.push(request);
          }));
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.toGenerator)(requests);
        }
        name() {
          return "HDB";
        }
        async canUpload(request) {
          if (!request.imdbId) return true;
          const queryUrl = "https://hdbits.org/browse.php?c3=1&c1=1&c2=1&tagsearchtype=or&imdb=" + request.imdbId + "&sort=size&h=8&d=DESC";
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.fetchAndParseHtml)(queryUrl);
          return result.querySelector("#resultsarea").textContent.includes("Nothing here!");
        }
        insertTrackersSelect(select) {
          document.querySelector("#moresearch3 > td:nth-child(2)").innerHTML += "<br><br>Find unique for:<br>";
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.addChild)(document.querySelector("#moresearch3 > td:nth-child(2)"), select);
        }
      }
    },
    "./src/trackers/HDSky.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => HDSky
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/dom/index.mjs");
      class HDSky {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return false;
        }
        canRun(url) {
          return url.includes("hdsky.me");
        }
        async* getSearchRequest() {
          const requests = [];
          for (const element of document.querySelectorAll(".torrents")[0].children[0].children) {
            if (!element.querySelector(".torrentname")) continue;
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element.querySelector(".torrentname"));
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(element.children[6]?.textContent);
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element
              } ],
              dom: element,
              imdbId,
              query: ""
            };
            requests.push(request);
          }
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.toGenerator)(requests);
        }
        name() {
          return "HDSky";
        }
        async canUpload(request) {
          return false;
        }
        insertTrackersSelect(select) {
          const element = document.querySelector(".searchbox").children[2].querySelector("td td.rowfollow tr");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.addChild)(element, select);
        }
      }
    },
    "./src/trackers/HDT.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => HDT
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/dom/index.mjs");
      class HDT {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return false;
        }
        canRun(url) {
          return url.includes("hd-torrents.org");
        }
        async* getSearchRequest() {
          const requests = [];
          document.querySelectorAll('table.mainblockcontenttt tr a[href^="details.php?id="]')?.forEach((element => {
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element.closest("td"));
            let line = element.closest("tr");
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(line.children[7]?.textContent);
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element
              } ],
              dom: line,
              imdbId,
              query: ""
            };
            requests.push(request);
          }));
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.toGenerator)(requests);
        }
        name() {
          return "HDT";
        }
        async canUpload(request) {
          return false;
        }
        insertTrackersSelect(select) {
          const element = document.querySelectorAll(".mainblockcontentsearch tr")[2];
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.addChild)(element, select);
        }
      }
    },
    "./src/trackers/IPT.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => CG
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/dom/index.mjs");
      class CG {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return false;
        }
        canRun(url) {
          return url.includes("iptorrents.com/movies");
        }
        async* getSearchRequest() {
          const requests = [];
          document.querySelectorAll(".mBox table")?.forEach((element => {
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element);
            const request = {
              torrents: [],
              dom: element.parentElement,
              imdbId,
              query: ""
            };
            requests.push(request);
          }));
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.toGenerator)(requests);
        }
        name() {
          return "IPT";
        }
        async canUpload(request) {
          return false;
        }
        insertTrackersSelect(select) {
          const element = document.createElement("p");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.addChild)(element, select);
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.insertAfter)(element, document.querySelector('.mBox form input[name="q"]').closest("p"));
        }
      }
    },
    "./src/trackers/JPTV.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => JPTV
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/dist/http/index.mjs");
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/dist/dom/index.mjs");
      class JPTV {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return false;
        }
        canRun(url) {
          return url.includes("jptv.club");
        }
        async* getSearchRequest() {
          const requests = [];
          let nodes = document.querySelectorAll(".view-torrent");
          for (const element of nodes) {
            let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_0__.fetchAndParseHtml)(element.href);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseImdbIdFromLink)(response);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseSize)(document.querySelector(".view-torrent").parentElement.parentElement.children[7].textContent.trim());
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element
              } ],
              dom: element,
              imdbId,
              query: ""
            };
            requests.push(request);
          }
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_2__.toGenerator)(requests);
        }
        name() {
          return "JPTV";
        }
        async canUpload(request) {
          return false;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.addChild)(document.querySelector(".form-torrent-search"), select);
        }
      }
    },
    "./src/trackers/KG.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => KG
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../common/dist/dom/index.mjs");
      var common_searcher__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/searcher/index.mjs");
      var common_trackers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/dist/trackers/index.mjs");
      const parseCategory = element => {
        const category = _tracker__WEBPACK_IMPORTED_MODULE_0__.Category.MOVIE;
        let img = element.querySelectorAll("td img")[0];
        const imageSrc = img.getAttribute("src");
        if (imageSrc?.includes("40.jpg")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.Category.AUDIOBOOK;
        if (imageSrc?.includes("41.jpg")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.Category.BOOK;
        if (img.getAttribute("title")?.includes("Music")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.Category.MUSIC;
        return category;
      };
      const parseTorrent = element => {
        const torrents = [];
        const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseSize)(element.querySelector("td:nth-child(11)")?.textContent?.replace(",", ""));
        let resolution = "SD";
        let format;
        if (element.querySelector('td img[src*="hdrip1080.png"]')) resolution = "1080p"; else if (element.querySelector('td img[src*="hdrip720.png"]')) resolution = "720p"; else if (element.querySelector('td img[src*="dvdr.png"]')) format = "VOB IFO"; else if (element.querySelector('td img[src*="bluray.png"]')) format = "m2ts";
        torrents.push({
          size,
          format,
          tags: [],
          resolution,
          dom: element
        });
        return torrents;
      };
      class KG {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return true;
        }
        canRun(url) {
          return url.includes("karagarga.in");
        }
        async* getSearchRequest() {
          const requests = [];
          document.querySelectorAll("#browse > tbody tr").forEach((element => {
            let linksContainer = element.querySelector("td:nth-child(2) > div > span:nth-child(1)");
            if (null === linksContainer) return;
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseImdbIdFromLink)(linksContainer);
            let torrents = parseTorrent(element);
            const request = {
              torrents,
              dom: element,
              imdbId,
              query: "",
              category: parseCategory(element)
            };
            requests.push(request);
          }));
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_0__.toGenerator)(requests);
        }
        name() {
          return "KG";
        }
        async canUpload(request) {
          if (!request.imdbId) return true;
          const result = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_2__.search)(common_trackers__WEBPACK_IMPORTED_MODULE_3__.KG, {
            movie_title: "",
            movie_imdb_id: request.imdbId
          });
          return result == common_searcher__WEBPACK_IMPORTED_MODULE_2__.SearchResult.NOT_FOUND;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_4__.insertBefore)(select, document.getElementById("showdead"));
        }
      }
    },
    "./src/trackers/MTeam.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => MTeam
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/dom/index.mjs");
      class MTeam {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return false;
        }
        canRun(url) {
          return url.includes("https://kp.m-team.cc") && (url.includes("torrents.php") || url.includes("movie.php"));
        }
        async* getSearchRequest() {
          const requests = [];
          for (const element of document.querySelectorAll(".torrents")[0].children[0].children) {
            if (!element.querySelector(".torrentname")) continue;
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element.querySelector(".torrentname"));
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(element.children[6]?.textContent);
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element
              } ],
              dom: element,
              imdbId,
              query: ""
            };
            requests.push(request);
          }
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.toGenerator)(requests);
        }
        name() {
          return "M-Team";
        }
        async canUpload(request) {
          return false;
        }
        insertTrackersSelect(select) {
          const element = document.querySelector(".searchbox").children[2].querySelector("td td.rowfollow tr");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.addChild)(element, select);
        }
      }
    },
    "./src/trackers/NewInsane.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => NewInsane
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/dom/index.mjs");
      class NewInsane {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return true;
        }
        canRun(url) {
          return url.includes("newinsane.info");
        }
        async* getSearchRequest() {
          const requests = [];
          document.querySelectorAll("table.torrenttable tr.torrentrow").forEach((element => {
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element);
            const request = {
              torrents: [],
              dom: element,
              imdbId,
              query: ""
            };
            requests.push(request);
          }));
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.toGenerator)(requests);
        }
        name() {
          return "NewInsane";
        }
        async canUpload(request) {
          return !request.imdbId;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.addChild)(document.querySelector(".searchbuttons.actiontitle"), select);
        }
      }
    },
    "./src/trackers/PTP.ts": (module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.a(module, (async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
        try {
          __webpack_require__.d(__webpack_exports__, {
            default: () => PTP
          });
          var _utils_cache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/utils/cache.ts");
          var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/utils/utils.ts");
          var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/trackers/tracker.ts");
          var common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../common/dist/http/index.mjs");
          var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/dom/index.mjs");
          var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([ _utils_cache__WEBPACK_IMPORTED_MODULE_3__ ]);
          _utils_cache__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
          function isSupportedCategory(category) {
            return void 0 === category || category === _tracker__WEBPACK_IMPORTED_MODULE_0__.Category.MOVIE || category === _tracker__WEBPACK_IMPORTED_MODULE_0__.Category.DOCUMENTARY || category === _tracker__WEBPACK_IMPORTED_MODULE_0__.Category.LIVE_PERFORMANCE;
          }
          const parseTorrents = element => {
            const torrents = [];
            if (element.classList.contains("cover-movie-list__movie")) return [];
            element.querySelectorAll("tr.basic-movie-list__torrent-row").forEach((element => {
              if (element.querySelector(".basic-movie-list__torrent-edition")) return;
              const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseSize)(element.children[2].textContent);
              let title = element.querySelector(".torrent-info-link").textContent;
              const resolution = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseResolution)(title);
              const tags = [];
              if (title.includes("Remux")) tags.push("Remux");
              const torrent = {
                dom: element,
                size,
                tags,
                resolution
              };
              torrents.push(torrent);
            }));
            return torrents;
          };
          const parseCategory = element => {
            const categoryTitle = element.querySelector(".basic-movie-list__torrent-edition__main")?.textContent;
            if (!categoryTitle) return null;
            if (categoryTitle.includes("Stand-up Comedy ")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.Category.STAND_UP; else if (categoryTitle.includes("Live Performance ")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.Category.LIVE_PERFORMANCE; else return _tracker__WEBPACK_IMPORTED_MODULE_0__.Category.MOVIE;
          };
          class PTP {
            canBeUsedAsSource() {
              return true;
            }
            canBeUsedAsTarget() {
              return true;
            }
            canRun(url) {
              return url.includes("passthepopcorn.me");
            }
            async* getSearchRequest() {
              const requests = [];
              const nodes = (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.findFirst)(document, "#torrents-movie-view table.torrent_table > tbody", "table.torrent_table > tbody tr.basic-movie-list__details-row", ".cover-movie-list__movie");
              nodes?.forEach((element => {
                let elements = (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.findFirst)(element, ".basic-movie-list__movie__ratings-and-tags", ".cover-movie-list__movie__rating-and-tags");
                const imdbId = elements ? (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseImdbIdFromLink)(elements[0]) : null;
                const request = {
                  torrents: parseTorrents(element),
                  dom: element,
                  imdbId,
                  query: "",
                  category: parseCategory(element)
                };
                requests.push(request);
              }));
              yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_0__.toGenerator)(requests);
            }
            name() {
              return "PTP";
            }
            async canUpload(request, onlyNew) {
              if (!isSupportedCategory(request.category)) return false;
              if (!request.imdbId) return true;
              let torrents = (0, _utils_cache__WEBPACK_IMPORTED_MODULE_3__.getFromMemoryCache)(request.imdbId);
              if (!torrents) {
                const query_url = "https://passthepopcorn.me/torrents.php?imdb=" + request.imdbId;
                const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_4__.fetchAndParseHtml)(query_url);
                torrents = parseAvailableTorrents(result);
                (0, _utils_cache__WEBPACK_IMPORTED_MODULE_3__.addToMemoryCache)(request.imdbId, torrents);
              }
              let notFound = !torrents.length;
              if (notFound) return true;
              if (onlyNew) return false;
              for (let torrent of request.torrents) if (canUploadTorrent(torrent, torrents)) {
                torrent.dom.style.border = "2px solid red";
                notFound = true;
              } else torrent.dom.style.display = "none";
              return notFound;
            }
            insertTrackersSelect(select) {
              let element = document.querySelector(".search-form__footer__buttons");
              if (!element) return;
              (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.insertBefore)(select, element);
            }
          }
          const parseAvailableTorrents = result => {
            const torrents = [];
            result.querySelectorAll('#torrent-table tr[id^="group_torrent_header_"]').forEach((line => {
              const data = line.children[0].textContent.trim().split("/");
              const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseSize)(line.children[1].textContent.trim());
              const tags = [];
              if (line.textContent.includes("Remux")) tags.push("Remux");
              const torrent = {
                container: data[0].split("]")[1].trim(),
                format: data[1].trim(),
                resolution: data[3].trim(),
                tags,
                size,
                dom: line
              };
              torrents.push(torrent);
            }));
            return torrents;
          };
          function sameContainer(first, second) {
            return first === second || "H.264" === first && "x264" === second || "x264" === first && "H.264" === second || "H.265" === first && "x265" === second || "x265" === first && "H.265" === second || "UHD100" === first && "BD100" === second || "BD100" === first && "UHD100" === second || "UHD66" === first && "BD66" === second || "BD66" === first && "UHD66" === second;
          }
          function isSD(resolution) {
            const sdResolutions = [ "SD", "PAL", "NTSC" ];
            if (sdResolutions.indexOf(resolution.toUpperCase())) return true;
            let height = resolution.replace("p", "");
            if (resolution.includes("x")) height = resolution.split("x")[1];
            if (parseInt(height) && parseInt(height) < 720) return true;
          }
          function sameResolution(first, second) {
            if (!first.resolution || !second.resolution) return true;
            if (first.resolution === second.resolution) return true;
            if ("SD" === first.resolution) return isSD(second.resolution);
            if ("SD" === second.resolution) return isSD(first.resolution);
          }
          const canUploadTorrent = (torrent, availableTorrents) => {
            const similarTorrents = availableTorrents.filter((e => sameResolution(torrent, e) && (void 0 === torrent.container || sameContainer(e.container, torrent.container)) && (!torrent.tags.includes("Remux") || e.tags.includes("Remux"))));
            if (0 == similarTorrents.length && torrent.resolution && torrent.container) return true;
            if (1 == similarTorrents.length) if (torrent.size > 1.5 * similarTorrents[0].size || similarTorrents[0].size > 1.5 * torrent.size) return true;
            return false;
          };
          __webpack_async_result__();
        } catch (e) {
          __webpack_async_result__(e);
        }
      }));
    },
    "./src/trackers/Pter.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => Pter
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/dist/dom/index.mjs");
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/http/index.mjs");
      function parseTorrent(element) {
        const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(element.childNodes[6].textContent);
        const title = element.querySelector(".torrentname a").textContent.trim();
        let resolution = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseResolution)(title);
        return {
          size,
          tags: [],
          dom: element,
          resolution
        };
      }
      function parseCategory(element) {
        let linkElement = element.querySelector('a[href^="?cat"]');
        let hrefValue = linkElement ? linkElement.getAttribute("href").trim() : null;
        if (hrefValue) hrefValue = hrefValue.replace("?cat=", "");
        switch (hrefValue) {
         case "401":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.MOVIE;

         case "402":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.DOCUMENTARY;

         case "403":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.ANIME;

         case "404":
         case "405":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.TV;

         case "406":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.MUSIC;

         case "407":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.SPORT;

         case "408":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.BOOK;

         case "409":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.GAME;

         case "411":
          {
            const source = element.children[0].children[1].querySelector("img").getAttribute("title").toLocaleUpperCase();
            switch (source) {
             case "PDF":
             case "MOBI":
             case "EPUB":
              return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.BOOK;
            }
            return null;
          }

         case "413":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.MV;

         case "418":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.LIVE_PERFORMANCE;
        }
      }
      const isExclusive = element => {
        const torrentName = element.querySelector(".torrentname");
        const exclusiveLink = torrentName.querySelector('a[href="torrents.php?tag_exclusive=yes"]');
        return null != exclusiveLink;
      };
      class Pter {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return true;
        }
        canRun(url) {
          return url.includes("pterclub.com");
        }
        async* getSearchRequest() {
          const requests = [];
          const elements = document.querySelectorAll("#torrenttable > tbody > tr");
          Array.from(elements).slice(1).forEach((element => {
            if (isExclusive(element)) {
              element.style.display = "none";
              return;
            }
            const spanElement = element.querySelector("span[data-imdbid]");
            let imdbId = spanElement ? spanElement.getAttribute("data-imdbid").trim() : null;
            if (imdbId) imdbId = "tt" + imdbId; else imdbId = null;
            const request = {
              torrents: [ parseTorrent(element) ],
              dom: element,
              imdbId,
              query: "",
              category: parseCategory(element)
            };
            requests.push(request);
          }));
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.toGenerator)(requests);
        }
        name() {
          return "Pter";
        }
        async canUpload(request) {
          if (!request.imdbId) return true;
          const queryUrl = `https://pterclub.com/torrents.php?search=${request.imdbId}`;
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.fetchAndParseHtml)(queryUrl);
          return null === result.querySelector("#torrenttable");
        }
        insertTrackersSelect(select) {
          const targetLine = document.querySelector(".searchbox > tbody:last-child table tr");
          const td = document.createElement("td");
          td.classList.add("embedded");
          td.appendChild(select);
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.addChild)(targetLine, td);
        }
      }
    },
    "./src/trackers/SC.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => SC
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/http/index.mjs");
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/dist/dom/index.mjs");
      function parseTorrent(element) {
        let infos = element.querySelector(".torrent_info .activity_info").querySelectorAll("div");
        let size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(infos[1].textContent);
        let resolution = infos[0].textContent.trim();
        if ("CD" == resolution || "WEB" == resolution) resolution = void 0;
        let format;
        if ("DVD-R" === resolution) {
          resolution = "SD";
          format = "VOB IFO";
        }
        return {
          size,
          tags: [],
          dom: element,
          resolution,
          format
        };
      }
      function parseCategory(element) {
        let category = _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.MOVIE;
        let infos = element.querySelector(".torrent_info .activity_info").querySelectorAll("div");
        let info = infos[0].textContent;
        if ("CD" == info || "WEB" === info) category = _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.MUSIC; else if ((0, 
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(infos[0].textContent)) category = _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.BOOK;
        return category;
      }
      class SC {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return true;
        }
        canRun(url) {
          return url.includes("secret-cinema.pw") && !url.includes("torrents.php?id");
        }
        async* getSearchRequest() {
          const requests = [];
          document.querySelectorAll(".torrent_card").forEach((element => {
            let dom = element;
            let links_container = element.querySelector(".torrent_tags");
            if (null === links_container) return;
            let imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(links_container);
            const request = {
              torrents: [ parseTorrent(element) ],
              dom,
              imdbId,
              query: "",
              category: parseCategory(element)
            };
            requests.push(request);
          }));
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.toGenerator)(requests);
        }
        name() {
          return "SC";
        }
        async canUpload(request) {
          if (!request.imdbId) return true;
          const queryUrl = `https://secret-cinema.pw/torrents.php?action=advanced&searchsubmit=1&cataloguenumber=${request.imdbId}&order_by=time&order_way=desc&tags_type=0`;
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.fetchAndParseHtml)(queryUrl);
          return null === result.querySelector(".torrent_card_container");
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.addChild)(document.querySelector("#ft_container p"), select);
        }
      }
    },
    "./src/trackers/TL.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => TL
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/dom/index.mjs");
      class TL {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return false;
        }
        canRun(url) {
          return url.includes("torrentleech.org");
        }
        async* getSearchRequest() {
          const requests = [];
          document.querySelectorAll(".torrent")?.forEach((element => {
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(element.querySelector(".td-size")?.textContent);
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element
              } ],
              dom: element,
              imdbId,
              query: ""
            };
            requests.push(request);
          }));
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.toGenerator)(requests);
        }
        name() {
          return "TL";
        }
        async canUpload(request) {
          return false;
        }
        insertTrackersSelect(select) {
          select.style.margin = "20px 0";
          select.style.padding = "2px 2px 3px 2px";
          select.style.color = "#111";
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.addChild)(document.querySelector(".sub-navbar"), select);
        }
      }
    },
    "./src/trackers/TSeeds.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => TSeeds
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../common/dist/dom/index.mjs");
      var common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/dist/http/index.mjs");
      var common_searcher__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/dist/searcher/index.mjs");
      var common_trackers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../common/dist/trackers/index.mjs");
      const parseCategory = element => {
        const icon = element.querySelector("i.torrent-icon");
        if (!icon) return;
        if (icon.classList.contains("fa-female")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.Category.XXX;
        if (icon.classList.contains("fa-tv")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.Category.TV;
        if (icon.classList.contains("fa-film")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.Category.MOVIE;
        if (icon.classList.contains("fa-music")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.Category.MUSIC;
        if (icon.classList.contains("fa-basketball-ball")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.Category.SPORT;
        if (icon.classList.contains("fa-gamepad")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.Category.GAME;
        return;
      };
      class TSeeds {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return true;
        }
        canRun(url) {
          return url.includes("torrentseeds.org");
        }
        async* getSearchRequest() {
          let torrentsSelector = "#torrent-list-table tbody tr";
          if (isCategoryPage()) torrentsSelector = ".cat-torrents table tbody tr";
          let nodes = document.querySelectorAll(torrentsSelector);
          yield {
            total: nodes.length
          };
          for (const element of nodes) {
            const category = parseCategory(element);
            let imdbId = null;
            if (category == _tracker__WEBPACK_IMPORTED_MODULE_0__.Category.MOVIE) {
              const link = element.querySelector('a.view-torrent[href*="/torrents/"]');
              let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_1__.fetchAndParseHtml)(link.href);
              imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.parseImdbIdFromLink)(response);
            }
            let sizeText = element.querySelector(".torrent-listings-size span")?.textContent;
            if (isCategoryPage()) sizeText = element.children[7]?.textContent?.trim();
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.parseSize)(sizeText);
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element
              } ],
              dom: element,
              imdbId,
              query: "",
              category
            };
            yield request;
          }
        }
        name() {
          return "TSeeds";
        }
        async canUpload(request) {
          if (!request.imdbId) return true;
          const result = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_3__.search)(common_trackers__WEBPACK_IMPORTED_MODULE_4__.TSeeds, {
            movie_title: "",
            movie_imdb_id: request.imdbId
          });
          return result == common_searcher__WEBPACK_IMPORTED_MODULE_3__.SearchResult.NOT_FOUND;
        }
        insertTrackersSelect(select) {
          if (isCategoryPage()) (0, common_dom__WEBPACK_IMPORTED_MODULE_5__.addChild)(document.querySelector(".table-responsive.cat-torrents .text-center"), select); else {
            const wrapper = document.createElement("div");
            wrapper.classList.add("form-group", "col-xs-3");
            wrapper.appendChild(select);
            (0, common_dom__WEBPACK_IMPORTED_MODULE_5__.addChild)(document.querySelector("#torrent-list-search div.row"), wrapper);
          }
        }
      }
      const isCategoryPage = () => document.location.toString().includes("/categories/");
    },
    "./src/trackers/TiK.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => TiK
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/utils/utils.ts");
      var common_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/dist/dom/index.mjs");
      const findTorrentsTable = () => {
        let tables = document.querySelectorAll("table");
        for (let table of tables) {
          let firstRow = table.querySelector("tr");
          let cells = firstRow.querySelectorAll("td");
          if (cells[0] && "Type" === cells[0].innerText && cells[1] && "Name" === cells[1].innerText && cells[2] && "Director" === cells[3].innerText) return table;
        }
        console.log("No torrents table found.");
        return;
      };
      class TiK {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return false;
        }
        canRun(url) {
          return url.includes("cinematik.net");
        }
        async* getSearchRequest() {
          const torrentsTable = findTorrentsTable();
          if (!torrentsTable) {
            yield {
              total: 0
            };
            return;
          }
          let nodes = torrentsTable.querySelectorAll("tr");
          yield {
            total: nodes.length - 1
          };
          for (let i = 1; i < nodes.length; i++) {
            const element = nodes[i];
            const link = element.querySelector('a[href*="details.php?id"]');
            if (!link) continue;
            let response = await fetchAndParseHtml(link.href);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(response);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(element.children[6].textContent);
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element
              } ],
              dom: element,
              imdbId,
              query: ""
            };
            yield request;
          }
        }
        name() {
          return "TiK";
        }
        async canUpload(request) {
          return false;
        }
        insertTrackersSelect(select) {
          const stateSelect = document.getElementById("incldead");
          const td = document.createElement("td");
          td.appendChild(select);
          (0, common_dom__WEBPACK_IMPORTED_MODULE_1__.insertBefore)(td, stateSelect.parentElement);
        }
      }
    },
    "./src/trackers/index.ts": (module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.a(module, (async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
        try {
          __webpack_require__.r(__webpack_exports__);
          __webpack_require__.d(__webpack_exports__, {
            Aither: () => _Aither__WEBPACK_IMPORTED_MODULE_18__.default,
            AvistaZ: () => _AvistaZ__WEBPACK_IMPORTED_MODULE_12__.default,
            BHD: () => _BHD__WEBPACK_IMPORTED_MODULE_7__.default,
            BLU: () => _BLU__WEBPACK_IMPORTED_MODULE_8__.default,
            BTarg: () => _BTarg__WEBPACK_IMPORTED_MODULE_10__.default,
            CG: () => _CG__WEBPACK_IMPORTED_MODULE_4__.default,
            CHD: () => _CHD__WEBPACK_IMPORTED_MODULE_21__.default,
            CLANSUD: () => _CLAN_SUD__WEBPACK_IMPORTED_MODULE_2__.default,
            CinemaZ: () => _CinemaZ__WEBPACK_IMPORTED_MODULE_11__.default,
            FL: () => _FL__WEBPACK_IMPORTED_MODULE_14__.default,
            GPW: () => _GPW__WEBPACK_IMPORTED_MODULE_15__.default,
            HDB: () => _HDB__WEBPACK_IMPORTED_MODULE_16__.default,
            HDSky: () => _HDSky__WEBPACK_IMPORTED_MODULE_22__.default,
            HDT: () => _HDT__WEBPACK_IMPORTED_MODULE_5__.default,
            IPT: () => _IPT__WEBPACK_IMPORTED_MODULE_6__.default,
            JPTV: () => _JPTV__WEBPACK_IMPORTED_MODULE_13__.default,
            KG: () => _KG__WEBPACK_IMPORTED_MODULE_3__.default,
            MTeam: () => _MTeam__WEBPACK_IMPORTED_MODULE_19__.default,
            NewInsane: () => _NewInsane__WEBPACK_IMPORTED_MODULE_9__.default,
            PTP: () => _PTP__WEBPACK_IMPORTED_MODULE_0__.default,
            Pter: () => _Pter__WEBPACK_IMPORTED_MODULE_24__.default,
            SC: () => _SC__WEBPACK_IMPORTED_MODULE_1__.default,
            TL: () => _TL__WEBPACK_IMPORTED_MODULE_17__.default,
            TSeeds: () => _TSeeds__WEBPACK_IMPORTED_MODULE_25__.default,
            TiK: () => _TiK__WEBPACK_IMPORTED_MODULE_23__.default,
            nCore: () => _nCore__WEBPACK_IMPORTED_MODULE_20__.default
          });
          var _Aither__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("./src/trackers/Aither.ts");
          var _AvistaZ__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./src/trackers/AvistaZ.ts");
          var _BHD__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/trackers/BHD.ts");
          var _BLU__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/trackers/BLU.ts");
          var _BTarg__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./src/trackers/BTarg.ts");
          var _CG__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/trackers/CG.ts");
          var _CLAN_SUD__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/trackers/CLAN-SUD.ts");
          var _CinemaZ__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./src/trackers/CinemaZ.ts");
          var _FL__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./src/trackers/FL.ts");
          var _GPW__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("./src/trackers/GPW.ts");
          var _HDB__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("./src/trackers/HDB.ts");
          var _HDT__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/trackers/HDT.ts");
          var _IPT__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/trackers/IPT.ts");
          var _JPTV__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./src/trackers/JPTV.ts");
          var _KG__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/trackers/KG.ts");
          var _NewInsane__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/trackers/NewInsane.ts");
          var _PTP__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/trackers/PTP.ts");
          var _SC__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/trackers/SC.ts");
          var _TiK__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__("./src/trackers/TiK.ts");
          var _TL__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("./src/trackers/TL.ts");
          var _MTeam__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__("./src/trackers/MTeam.ts");
          var _nCore__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__("./src/trackers/nCore.ts");
          var _CHD__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__("./src/trackers/CHD.ts");
          var _HDSky__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__("./src/trackers/HDSky.ts");
          var _Pter__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__("./src/trackers/Pter.ts");
          var _TSeeds__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__("./src/trackers/TSeeds.ts");
          var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([ _PTP__WEBPACK_IMPORTED_MODULE_0__ ]);
          _PTP__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
          __webpack_async_result__();
        } catch (e) {
          __webpack_async_result__(e);
        }
      }));
    },
    "./src/trackers/nCore.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => MTeam
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/utils/utils.ts");
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/trackers/tracker.ts");
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/dist/dom/index.mjs");
      class MTeam {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return false;
        }
        canRun(url) {
          return url.includes("https://ncore.pro");
        }
        async* getSearchRequest() {
          const requests = [];
          for (const element of document.querySelectorAll(".box_torrent")) {
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(element.children[1].children[4].textContent);
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element
              } ],
              dom: element,
              imdbId,
              query: ""
            };
            requests.push(request);
          }
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.toGenerator)(requests);
        }
        name() {
          return "nCore";
        }
        async canUpload(request) {
          return false;
        }
        insertTrackersSelect(select) {
          const element = document.querySelector("#keresoresz tr");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.addChild)(element, select);
        }
      }
    },
    "./src/trackers/tracker.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Category: () => Category,
        toGenerator: () => toGenerator
      });
      let Category = function(Category) {
        Category[Category.TV = 0] = "TV";
        Category[Category.MOVIE = 1] = "MOVIE";
        Category[Category.MUSIC = 2] = "MUSIC";
        Category[Category.BOOK = 3] = "BOOK";
        Category[Category.AUDIOBOOK = 4] = "AUDIOBOOK";
        Category[Category.SPORT = 5] = "SPORT";
        Category[Category.ANIME = 6] = "ANIME";
        Category[Category.MV = 7] = "MV";
        Category[Category.LIVE_PERFORMANCE = 8] = "LIVE_PERFORMANCE";
        Category[Category.STAND_UP = 9] = "STAND_UP";
        Category[Category.DOCUMENTARY = 10] = "DOCUMENTARY";
        Category[Category.GAME = 11] = "GAME";
        Category[Category.XXX = 12] = "XXX";
        return Category;
      }({});
      const toGenerator = async function*(requests) {
        yield {
          total: requests.length
        };
        for (const request of requests) yield request;
      };
    },
    "./src/utils/cache.ts": (module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.a(module, (async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
        try {
          __webpack_require__.d(__webpack_exports__, {
            addToCache: () => addToCache,
            addToMemoryCache: () => addToMemoryCache,
            clearMemoryCache: () => clearMemoryCache,
            existsInCache: () => existsInCache,
            getFromMemoryCache: () => getFromMemoryCache
          });
          let cache = await GM.getValue("cache", {});
          let memoryCache = {};
          const existsInCache = (tracker, key) => {
            if (cache[tracker]) return cache[tracker].indexOf(key) > -1;
            return false;
          };
          const addToMemoryCache = (key, value) => {
            memoryCache[key] = value;
          };
          const getFromMemoryCache = key => memoryCache[key];
          const clearMemoryCache = () => {
            memoryCache = {};
          };
          const addToCache = async (tracker, imdb_id) => {
            let tracker_cache = cache[tracker];
            if (!tracker_cache) tracker_cache = [];
            tracker_cache.push(imdb_id);
            cache[tracker] = tracker_cache;
            await GM.setValue("cache", cache);
          };
          __webpack_async_result__();
        } catch (e) {
          __webpack_async_result__(e);
        }
      }), 1);
    },
    "./src/utils/dom.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        addCounter: () => addCounter,
        createTrackersSelect: () => createTrackersSelect,
        updateCount: () => updateCount,
        updateNewContent: () => updateNewContent,
        updateTotalCount: () => updateTotalCount
      });
      const createTrackersSelect = trackers => {
        let select_dom = document.createElement("select");
        select_dom.id = "tracker-select";
        select_dom.style.margin = "0 5px";
        const opt = document.createElement("option");
        opt.disabled = true;
        opt.selected = true;
        opt.innerHTML = "Select target tracker";
        select_dom.appendChild(opt);
        for (let i = 0; i < trackers.length; i++) {
          const opt = document.createElement("option");
          opt.value = trackers[i];
          opt.innerHTML = trackers[i];
          select_dom.appendChild(opt);
        }
        return select_dom;
      };
      const createMessageBox = () => {
        let div = document.getElementById("message-box");
        if (div) return div;
        div = document.createElement("div");
        div.id = "message-box";
        addStyle(div);
        div.addEventListener("click", (() => div.style.display = "none"));
        document.body.appendChild(div);
        return div;
      };
      const addCounter = () => {
        let messageBox = createMessageBox();
        messageBox.innerHTML = 'Checked: <span class="checked_count">0</span>/<span class="total_torrents_count">0</span> | New content: <span class="new_content_count">0</span>';
        messageBox.style.display = "block";
      };
      const addStyle = messageBox => {
        messageBox.style.padding = "9px 26px";
        messageBox.style.position = "fixed";
        messageBox.style.top = "50px";
        messageBox.style.right = "50px";
        messageBox.style.background = "#eaeaea";
        messageBox.style.borderRadius = "9px";
        messageBox.style.fontSize = "17px";
        messageBox.style.color = "#111";
        messageBox.style.cursor = "pointer";
        messageBox.style.border = "2px solid #111";
        messageBox.style.zIndex = "4591363";
      };
      const updateCount = count => {
        document.querySelector(".checked_count").textContent = String(count);
      };
      const updateTotalCount = count => {
        document.querySelector(".total_torrents_count").textContent = String(count);
      };
      const updateNewContent = count => {
        document.querySelector(".new_content_count").textContent = String(count);
      };
    },
    "./src/utils/utils.ts": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        parseImdbId: () => parseImdbId,
        parseImdbIdFromLink: () => parseImdbIdFromLink,
        parseResolution: () => parseResolution,
        parseSize: () => parseSize
      });
      const parseSize = text => {
        let size = null;
        text = text.replace("GiB", "GB").replace("MiB", "MB");
        if (text.includes("GB")) size = 1024 * parseFloat(text.split("GB")[0]); else if (text.includes("MB")) size = parseFloat(text.split("MB")[0]);
        return size;
      };
      const parseImdbIdFromLink = element => {
        const imdbLink = element.querySelector('[href*="imdb.com/title/tt"]');
        if (imdbLink) return "tt" + imdbLink.href.split("/tt")[1].replace("/", "").trim().replaceAll(/\?.+/g, "");
        return null;
      };
      const parseImdbId = text => {
        if (!text) return null;
        const results = text.match(/(tt\d+)/);
        if (!results) return null;
        return results[0];
      };
      const parseResolution = text => {
        const resolutions = [ "720p", "1080p", "2160p" ];
        if (!text) return null;
        for (let resolution of resolutions) if (text.includes(resolution)) return resolution;
        const regex = /\b(\d{3})x(\d{3})\b/;
        const match = text.match(regex);
        if (match) return match[0];
        return null;
      };
    },
    "../common/dist/dom/index.mjs": (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        addChild: () => addChild,
        appendErrorMessage: () => appendErrorMessage,
        findFirst: () => findFirst,
        insertAfter: () => insertAfter,
        insertBefore: () => insertBefore,
        showError: () => showError
      });
      const insertBefore = (newNode, existingNode) => {
        existingNode.parentNode.insertBefore(newNode, existingNode);
      };
      const insertAfter = (newNode, existingNode) => {
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
      };
      const addChild = (parent, child) => {
        parent.appendChild(child);
      };
      const appendErrorMessage = () => {
        const div = document.createElement("div");
        div.innerHTML = '<span style="margin-left:15px;color:white;font-weight:bold;float:right;font-size:22px;line-height:20px;cursor:pointer;transition:0.3s;\n" onclick="this.parentElement.style.display=\'none\';">&times;</span><span id="message"></span>';
        div.style.position = "fixed";
        div.style.bottom = "50px";
        div.style.left = "50%";
        div.style.display = "none";
        div.style.width = "50%";
        div.style.padding = "20px";
        div.style.transform = "translate(-50%, 0)";
        div.style.backgroundColor = "#f44336";
        div.style.color = "white";
        addChild(document.body, div);
      };
      const showError = message => {
        const element = document.querySelector("#message");
        element.innerHTML = "Error occurred in Fin Unique titles script: " + message;
        element.parentElement.style.display = "block";
      };
      const findFirst = (element, ...selectors) => {
        for (let selector of selectors) {
          let elements = element.querySelectorAll(selector);
          if (elements.length > 0) return elements;
        }
        return null;
      };
    },
    "../common/dist/http/index.mjs": (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        fetchAndParseHtml: () => fetchAndParseHtml,
        fetchUrl: () => fetchUrl
      });
      var _trim21_gm_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@trim21/gm-fetch/dist/index.mjs");
      const parser = new DOMParser;
      const fetchUrl = async (input, options = {}, wait = 1e3) => {
        await sleep(wait);
        const res = await (0, _trim21_gm_fetch__WEBPACK_IMPORTED_MODULE_0__.default)(input, options);
        return await res.text();
      };
      const fetchAndParseHtml = async query_url => {
        const response = await fetchUrl(query_url);
        return parser.parseFromString(response, "text/html").body;
      };
      const sleep = ms => new Promise((resolve => setTimeout(resolve, ms)));
    },
    "../common/dist/searcher/index.mjs": (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        SearchResult: () => SearchResult,
        search: () => search
      });
      var _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/dist/http/index.mjs");
      var SearchResult;
      !function(SearchResult) {
        SearchResult[SearchResult.FOUND = 0] = "FOUND";
        SearchResult[SearchResult.NOT_FOUND = 1] = "NOT_FOUND";
        SearchResult[SearchResult.LOGGED_OUT = 2] = "LOGGED_OUT";
        SearchResult[SearchResult.ERROR = 3] = "ERROR";
      }(SearchResult || (SearchResult = {}));
      const search = async (tracker, options) => {
        "rateLimit" in tracker && tracker.rateLimit;
        tracker.searchUrl.split("/")[2];
        (new Date).getTime();
        const success_match = "positiveMatch" in tracker ? tracker.positiveMatch : false;
        const searchUrl = await replaceSearchUrlParams(tracker, options);
        if (searchUrl.indexOf("=00000000") > -1 || searchUrl.indexOf("=undefined") > -1) return SearchResult.ERROR;
        let response;
        let reqHeader = {};
        if ("Milkie" == tracker.name) reqHeader = {
          Host: "milkie.cc",
          Authorization: options.milkie_authToken
        }; else if ("TNT" == tracker.name) reqHeader = {
          Host: "tntracker.org",
          Authorization: options.tnt_authToken
        }; else if ("DonTor" == tracker.name) reqHeader = {
          Host: "dontorrent.ninja",
          Referer: "https://dontorrent.ninja"
        };
        if ("mPOST" in tracker) {
          const post_data = await replaceSearchUrlParams(tracker, options);
          response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.fetchUrl)(searchUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
              ...reqHeader
            },
            body: post_data
          });
        } else response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.fetchUrl)(searchUrl, {
          headers: reqHeader
        });
        if (tracker.positiveMatch && tracker.loggedOutRegex && response.match(tracker.loggedOutRegex)) return SearchResult.LOGGED_OUT; else if (response.match(tracker.matchRegex) ? !success_match : success_match) return SearchResult.NOT_FOUND; else if (tracker.loggedOutRegex && response.match(tracker.loggedOutRegex)) return SearchResult.LOGGED_OUT; else return SearchResult.FOUND;
      };
      const replaceSearchUrlParams = async (tracker, options) => {
        let search_url = "mPOST" in tracker ? tracker.mPOST : tracker.searchUrl;
        if ("goToUrl" in tracker) search_url = tracker.goToUrl;
        let movie_id = options.movie_imdb_id;
        if (options.movie_imdb_id) {
          if (search_url.match("%tvdbid%")) movie_id = await getTVDbID(options.movie_imdb_id); else if (search_url.match("%tmdbid%")) movie_id = await getTMDbID(options.movie_imdb_id); else if (search_url.match("%doubanid%")) movie_id = await getDoubanID0(options.movie_imdb_id);
          if (search_url.match("%doubanid%") && "00000000" == movie_id) movie_id = await getDoubanID1(options.movie_imdb_id);
          if (search_url.match("%doubanid%") && "00000000" == movie_id) movie_id = await getDoubanID2(options.movie_imdb_id);
          if (search_url.match("%doubanid%") && "00000000" == movie_id) movie_id = await getDoubanID3(options.movie_imdb_id);
        }
        const space_replace = "spaceEncode" in tracker ? tracker.spaceEncode : "+";
        const search_string = options.movie_title || "".trim().replace(/ +\(.*|&|:/g, "").replace(/\s+/g, space_replace);
        const search_string_orig = options.movie_original_title?.trim().replace(/ +\(.*|&|:/g, "").replace(/\s+/g, space_replace);
        return search_url.replace(/%tt%/g, movie_id).replace(/%nott%/g, movie_id.substring(2)).replace(/%tvdbid%/g, movie_id).replace(/%tmdbid%/g, movie_id).replace(/%doubanid%/g, movie_id).replace(/%seriesid%/g, options.series_id).replace(/%seasonid%/g, options.season_id).replace(/%episodeid%/g, options.episode_id).replace(/%search_string%/g, search_string).replace(/%search_string_orig%/g, search_string_orig).replace(/%year%/g, options.movie_year).replace(/---/g, "-");
      };
      const getTVDbID = async imdbID => {
        const url = "https://thetvdb.com/api/GetSeriesByRemoteID.php?imdbid=" + imdbID;
        const response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.fetchUrl)(url);
        if (response.match("seriesid")) {
          const xmldata = (new DOMParser).parseFromString(response, "application/xml");
          return xmldata.getElementsByTagName("seriesid")[0].childNodes[0].nodeValue;
        }
        return "00000000";
      };
      const getTMDbID = async imdbID => {
        const url = "https://api.themoviedb.org/3/find/" + imdbID + "?api_key=d12b33d3f4fb8736dc06f22560c4f8d4&external_source=imdb_id";
        const response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.fetchUrl)(url);
        const result = JSON.parse(response);
        if (result.movie_results && result.movie_results.length > 0) return result.movie_results[0].id; else if (result.tv_results && result.tv_results.length > 0) return result.tv_results[0].id; else if (result.tv_episode_results && result.tv_episode_results.length > 0) return result.tv_episode_results[0].id;
        return "00000000";
      };
      const getDoubanID0 = async imdbID => {
        const url = "https://movie.douban.com/j/subject_suggest?q=" + imdbID;
        const response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.fetchUrl)(url);
        const result = JSON.parse(response);
        if (result && result.length) return result[0].id;
        return "00000000";
      };
      const getDoubanID1 = async imdbID => {
        const url = "https://www.douban.com/search?cat=1002&q=" + imdbID;
        const result = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.fetchAndParseHtml)(url);
        const element = result.querySelector("[onclick*=" + imdbID + "]");
        if (element) {
          const href = element.getAttribute("href");
          if (href && href.match(/subject%2F(\d+)/)) return href.match(/subject%2F(\d+)/)[1];
        }
        return "00000000";
      };
      const getDoubanID2 = async imdbID => {
        const url = 'https://query.wikidata.org/sparql?format=json&query=SELECT * WHERE {?s wdt:P345 "' + imdbID + '". OPTIONAL { ?s wdt:P4529 ?Douban_film_ID. }}';
        const response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.fetchUrl)(url);
        const result = JSON.parse(response);
        if (null != result.results.bindings[0]) if (null != result.results.bindings[0].Douban_film_ID) return result.results.bindings[0].Douban_film_ID.value;
        return "00000000";
      };
      const getDoubanID3 = async imdbID => {
        const url = 'https://www.google.com/search?q="' + imdbID + '" site:https://movie.douban.com/subject&safe=off';
        const result = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.fetchUrl)(url);
        if (result.match("movie.douban.com/subject/")) {
          const x = result.split("movie.douban.com/subject/")[1];
          return x.split("/")[0];
        } else return "00000000";
      };
    },
    "../common/dist/trackers/index.mjs": (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        KG: () => KG,
        TSeeds: () => TSeeds
      });
      const KG = {
        TV: false,
        name: "KG",
        searchUrl: "https://karagarga.in/browse.php?sort=added&search=%nott%&search_type=imdb&d=DESC",
        loggedOutRegex: /Cloudflare|Ray ID|Not logged in!/,
        matchRegex: /No torrents found/,
        rateLimit: 125,
        both: true
      };
      const TSeeds = {
        TV: false,
        name: "TSeeds",
        searchUrl: "https://www.torrentseeds.org/torrents?tmdbId=%tmdbid%",
        loggedOutRegex: /Cloudflare|Forgot Your Password|Service Unavailable/,
        matchRegex: /"Download">/,
        positiveMatch: true,
        both: true
      };
    },
    "../node_modules/@trim21/gm-fetch/dist/index.mjs": (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => GM_fetch
      });
      function parseRawHeaders(h) {
        const s = h.trim();
        if (!s) return new Headers;
        const array = s.split("\r\n").map((value => {
          let s = value.split(":");
          return [ s[0].trim(), s[1].trim() ];
        }));
        return new Headers(array);
      }
      function parseGMResponse(req, res) {
        return new ResImpl(res.response, {
          statusCode: res.status,
          statusText: res.statusText,
          headers: parseRawHeaders(res.responseHeaders),
          finalUrl: res.finalUrl,
          redirected: res.finalUrl === req.url
        });
      }
      class ResImpl {
        constructor(body, init) {
          this.rawBody = body;
          this.init = init;
          this.body = toReadableStream(body);
          const {headers, statusCode, statusText, finalUrl, redirected} = init;
          this.headers = headers;
          this.status = statusCode;
          this.statusText = statusText;
          this.url = finalUrl;
          this.type = "basic";
          this.redirected = redirected;
          this._bodyUsed = false;
        }
        get bodyUsed() {
          return this._bodyUsed;
        }
        get ok() {
          return this.status < 300;
        }
        arrayBuffer() {
          if (this.bodyUsed) throw new TypeError("Failed to execute 'arrayBuffer' on 'Response': body stream already read");
          this._bodyUsed = true;
          return this.rawBody.arrayBuffer();
        }
        blob() {
          if (this.bodyUsed) throw new TypeError("Failed to execute 'blob' on 'Response': body stream already read");
          this._bodyUsed = true;
          return Promise.resolve(this.rawBody.slice(0, this.rawBody.length, this.rawBody.type));
        }
        clone() {
          if (this.bodyUsed) throw new TypeError("Failed to execute 'clone' on 'Response': body stream already read");
          return new ResImpl(this.rawBody, this.init);
        }
        formData() {
          if (this.bodyUsed) throw new TypeError("Failed to execute 'formData' on 'Response': body stream already read");
          this._bodyUsed = true;
          return this.rawBody.text().then(decode);
        }
        async json() {
          if (this.bodyUsed) throw new TypeError("Failed to execute 'json' on 'Response': body stream already read");
          this._bodyUsed = true;
          return JSON.parse(await this.rawBody.text());
        }
        text() {
          if (this.bodyUsed) throw new TypeError("Failed to execute 'text' on 'Response': body stream already read");
          this._bodyUsed = true;
          return this.rawBody.text();
        }
      }
      function decode(body) {
        const form = new FormData;
        body.trim().split("&").forEach((function(bytes) {
          if (bytes) {
            const split = bytes.split("=");
            const name = split.shift()?.replace(/\+/g, " ");
            const value = split.join("=").replace(/\+/g, " ");
            form.append(decodeURIComponent(name), decodeURIComponent(value));
          }
        }));
        return form;
      }
      function toReadableStream(value) {
        return new ReadableStream({
          start(controller) {
            controller.enqueue(value);
            controller.close();
          }
        });
      }
      async function GM_fetch(input, init) {
        const request = new Request(input, init);
        let data;
        if (init?.body) data = await request.text();
        return await XHR(request, init, data);
      }
      function XHR(request, init, data) {
        return new Promise(((resolve, reject) => {
          if (request.signal && request.signal.aborted) return reject(new DOMException("Aborted", "AbortError"));
          GM.xmlHttpRequest({
            url: request.url,
            method: gmXHRMethod(request.method.toUpperCase()),
            headers: Object.fromEntries(new Headers(init?.headers).entries()),
            data,
            responseType: "blob",
            onload(res) {
              resolve(parseGMResponse(request, res));
            },
            onabort() {
              reject(new DOMException("Aborted", "AbortError"));
            },
            ontimeout() {
              reject(new TypeError("Network request failed, timeout"));
            },
            onerror(err) {
              reject(new TypeError("Failed to fetch: " + err.finalUrl));
            }
          });
        }));
      }
      const httpMethods = [ "GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "TRACE", "OPTIONS", "CONNECT" ];
      function includes(array, element) {
        return array.includes(element);
      }
      function gmXHRMethod(method) {
        if (includes(httpMethods, method)) return method;
        throw new Error(`unsupported http method ${method}`);
      }
    }
  };
  var __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (void 0 !== cachedModule) return cachedModule.exports;
    var module = __webpack_module_cache__[moduleId] = {
      exports: {}
    };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }
  webpackQueues = "function" == typeof Symbol ? Symbol("webpack queues") : "__webpack_queues__", 
  webpackExports = "function" == typeof Symbol ? Symbol("webpack exports") : "__webpack_exports__", 
  webpackError = "function" == typeof Symbol ? Symbol("webpack error") : "__webpack_error__", 
  resolveQueue = queue => {
    if (queue && !queue.d) {
      queue.d = 1;
      queue.forEach((fn => fn.r--));
      queue.forEach((fn => fn.r-- ? fn.r++ : fn()));
    }
  }, wrapDeps = deps => deps.map((dep => {
    if (null !== dep && "object" == typeof dep) {
      if (dep[webpackQueues]) return dep;
      if (dep.then) {
        var queue = [];
        queue.d = 0;
        dep.then((r => {
          obj[webpackExports] = r;
          resolveQueue(queue);
        }), (e => {
          obj[webpackError] = e;
          resolveQueue(queue);
        }));
        var obj = {};
        obj[webpackQueues] = fn => fn(queue);
        return obj;
      }
    }
    var ret = {};
    ret[webpackQueues] = x => {};
    ret[webpackExports] = dep;
    return ret;
  })), __webpack_require__.a = (module, body, hasAwait) => {
    var queue;
    hasAwait && ((queue = []).d = 1);
    var depQueues = new Set;
    var exports = module.exports;
    var currentDeps;
    var outerResolve;
    var reject;
    var promise = new Promise(((resolve, rej) => {
      reject = rej;
      outerResolve = resolve;
    }));
    promise[webpackExports] = exports;
    promise[webpackQueues] = fn => (queue && fn(queue), depQueues.forEach(fn), promise.catch((x => {})));
    module.exports = promise;
    body((deps => {
      currentDeps = wrapDeps(deps);
      var fn;
      var getResult = () => currentDeps.map((d => {
        if (d[webpackError]) throw d[webpackError];
        return d[webpackExports];
      }));
      var promise = new Promise((resolve => {
        fn = () => resolve(getResult);
        fn.r = 0;
        var fnQueue = q => q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, 
        q.push(fn)));
        currentDeps.map((dep => dep[webpackQueues](fnQueue)));
      }));
      return fn.r ? promise : getResult();
    }), (err => (err ? reject(promise[webpackError] = err) : outerResolve(exports), 
    resolveQueue(queue))));
    queue && (queue.d = 0);
  };
  var webpackQueues, webpackExports, webpackError, resolveQueue, wrapDeps;
  __webpack_require__.d = (exports, definition) => {
    for (var key in definition) if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) Object.defineProperty(exports, key, {
      enumerable: true,
      get: definition[key]
    });
  };
  __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
  __webpack_require__.r = exports => {
    if ("undefined" != typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports, Symbol.toStringTag, {
      value: "Module"
    });
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
  };
  __webpack_require__("./src/index.ts");
})();