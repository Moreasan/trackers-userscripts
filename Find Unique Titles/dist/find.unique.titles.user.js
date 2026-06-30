// ==UserScript==
// @name Find Unique Titles
// @description Find unique titles to cross seed
// @version 0.0.11
// @author Mea01
// @match https://aither.cc/torrents?*
// @match https://avistaz.to/movies*
// @match https://beyond-hd.me/torrents*
// @match https://beyond-hd.me/library/*
// @match https://blutopia.cc/torrents*
// @match https://btarg.com.ar/tracker/browse.php*
// @match https://js.chddiy.xyz/torrents.php*
// @match https://ptchdbits.co/torrents.php*
// @match https://discfan.net/torrents.php*
// @match https://cinemageddon.net/browse.php*
// @match https://www.cinematik.net/browse.php*
// @match https://cinemaz.to/movies*
// @match https://filelist.io/browse.php*
// @match https://filelist.io/internal.php
// @match https://www.clan-sudamerica.net/invision/*
// @match https://greatposterwall.com/torrents.php*
// @match https://hdbits.org/browse.php*
// @match https://hdsky.me/torrents.php*
// @match https://hd-torrents.org/torrents.php*
// @match https://iptorrents.com/t*
// @match https://jpopsuki.eu/torrents.php*
// @match https://jptv.club/torrents*
// @match https://karagarga.in/browse.php*
// @match https://kp.m-team.cc/*
// @match https://lat-team.com/torrents*
// @match https://www.morethantv.me/torrents/browse*
// @match https://ncore.pro/torrents.php*
// @match https://newinsane.info/browse.php*
// @match https://passthepopcorn.me/torrents.php*
// @match https://passthepopcorn.me/torrents.php?type=seeding
// @match https://pterclub.com/torrents.php*
// @match https://secret-cinema.pw/torrents.php*
// @match https://tntracker.org/*
// @match https://www.torrentleech.org/torrents/browse*
// @match https://pterc.com/torrents.php*
// @match https://torrentseeds.org/torrents*
// @match https://torrentseeds.org/categories/*
// @downloadURL https://github.com/Moreasan/trackers-userscripts/blob/master/Find%20Unique%20Titles/dist/find.unique.titles.user.js
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
    940: (module, __unused_webpack___webpack_exports__, __webpack_require__) => {
      __webpack_require__.a(module, (async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
        try {
          var _trackers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(54);
          var _trackers_tracker__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(84);
          var _utils_cache__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(698);
          var _utils_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(996);
          var _settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(97);
          var common_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(933);
          var common_http__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(257);
          var common_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(616);
          var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([ _trackers__WEBPACK_IMPORTED_MODULE_2__, _utils_cache__WEBPACK_IMPORTED_MODULE_4__ ]);
          [_trackers__WEBPACK_IMPORTED_MODULE_2__, _utils_cache__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
          function hideTorrents(request) {
            for (let element of request.dom) element.style.display = "none";
            for (let torrent of request.torrents) torrent.dom.style.display = "none";
          }
          const setUpLogger = debugMode => {
            common_logger__WEBPACK_IMPORTED_MODULE_0__.k.setPrefix("[Find Unique Titles]");
            if (debugMode) common_logger__WEBPACK_IMPORTED_MODULE_0__.k.setLevel(common_logger__WEBPACK_IMPORTED_MODULE_0__.z.DEBUG);
          };
          const main = async function() {
            const settings = (0, _settings__WEBPACK_IMPORTED_MODULE_1__.G)();
            setUpLogger(settings.debug);
            common_logger__WEBPACK_IMPORTED_MODULE_0__.k.info("Init User script");
            if (document.getElementById("tracker-select")) return;
            const url = window.location.href;
            let sourceTracker = null;
            let targetTrackers = [];
            Object.keys(_trackers__WEBPACK_IMPORTED_MODULE_2__).forEach((trackerName => {
              const trackerImplementation = new _trackers__WEBPACK_IMPORTED_MODULE_2__[trackerName];
              if (trackerImplementation.canRun(url)) sourceTracker = trackerImplementation; else if (trackerImplementation.canBeUsedAsTarget()) targetTrackers.push(trackerImplementation);
            }));
            if (null == sourceTracker) return;
            const select = (0, _utils_dom__WEBPACK_IMPORTED_MODULE_3__.WC)(targetTrackers.map((tracker => tracker.name())));
            select.addEventListener("change", (async () => {
              let answer = confirm("Start searching new content for:  " + select.value);
              if (answer) {
                const targetTracker = targetTrackers.find((tracker => tracker.name() === select.value));
                let i = 1;
                let newContent = 0;
                let requestGenerator = sourceTracker.getSearchRequest();
                const metadata = (await requestGenerator.next()).value;
                (0, _utils_dom__WEBPACK_IMPORTED_MODULE_3__.X_)();
                (0, _utils_dom__WEBPACK_IMPORTED_MODULE_3__.I5)(metadata.total);
                common_logger__WEBPACK_IMPORTED_MODULE_0__.k.debug("[{0}] Parsing titles to check", sourceTracker.name());
                for await (const item of requestGenerator) {
                  if (null == item) continue;
                  const request = item;
                  common_logger__WEBPACK_IMPORTED_MODULE_0__.k.debug("[{0}] Search request: {1}", sourceTracker.name(), request);
                  try {
                    if (settings.useCache && request.imdbId && (0, _utils_cache__WEBPACK_IMPORTED_MODULE_4__.ff)(targetTracker.name(), request.imdbId)) {
                      common_logger__WEBPACK_IMPORTED_MODULE_0__.k.debug("Title exists in target tracker, found using cache");
                      hideTorrents(request);
                      continue;
                    }
                    await (0, common_http__WEBPACK_IMPORTED_MODULE_5__._v)(targetTracker.waitTimeInMillisBetweenRequest());
                    const response = await targetTracker.search(request);
                    common_logger__WEBPACK_IMPORTED_MODULE_0__.k.debug("Search response: {0}", response);
                    if (response == _trackers_tracker__WEBPACK_IMPORTED_MODULE_6__.lt.EXIST || response == _trackers_tracker__WEBPACK_IMPORTED_MODULE_6__.lt.NOT_ALLOWED) {
                      if (request.imdbId) await (0, _utils_cache__WEBPACK_IMPORTED_MODULE_4__.se)(targetTracker.name(), request.imdbId);
                      hideTorrents(request);
                    } else if (response == _trackers_tracker__WEBPACK_IMPORTED_MODULE_6__.lt.NOT_LOGGED_IN) {
                      alert(`You are not logged in ${targetTracker.name()}`);
                      break;
                    } else {
                      newContent++;
                      (0, _utils_dom__WEBPACK_IMPORTED_MODULE_3__.t)(newContent);
                      if (response == _trackers_tracker__WEBPACK_IMPORTED_MODULE_6__.lt.MAYBE_NOT_EXIST) {
                        request.dom[0].setAttribute("title", "Title may not exist on target tracker");
                        request.dom[0].style.border = "2px solid #9b59b6";
                      } else if (response == _trackers_tracker__WEBPACK_IMPORTED_MODULE_6__.lt.NOT_EXIST_WITH_REQUEST) {
                        request.dom[0].setAttribute("title", "Title was not found and has matching requests");
                        request.dom[0].style.border = "2px solid #2ecc71";
                      } else if (response == _trackers_tracker__WEBPACK_IMPORTED_MODULE_6__.lt.MAYBE_NOT_EXIST_WITH_REQUEST) {
                        request.dom[0].setAttribute("title", "Title may not exists and there are matching requests");
                        request.dom[0].style.border = "2px solid #e67e22";
                      } else if (response == _trackers_tracker__WEBPACK_IMPORTED_MODULE_6__.lt.NOT_CHECKED) {
                        request.dom[0].setAttribute("title", "Title was not checked on target tracker");
                        request.dom[0].style.border = "2px solid #e74c3c";
                      } else if (response == _trackers_tracker__WEBPACK_IMPORTED_MODULE_6__.lt.NOT_EXIST) {
                        request.dom[0].setAttribute("title", "Title was not found on target tracker");
                        request.dom[0].style.border = "2px solid #3498db";
                      } else if (response == _trackers_tracker__WEBPACK_IMPORTED_MODULE_6__.lt.EXIST_BUT_MISSING_SLOT) {
                        request.dom[0].setAttribute("title", "Title exists but there is an available slot on target tracker");
                        request.dom[0].style.border = "2px solid #ff00ff";
                      }
                    }
                  } catch (e) {
                    console.trace("Error occurred: ", e);
                    common_logger__WEBPACK_IMPORTED_MODULE_0__.k.info("Error occurred when checking {0}, {1]", request, e);
                    request.dom[0].setAttribute("title", "Title was not checked due to an error");
                    request.dom[0].style.border = "2px solid red";
                  } finally {
                    (0, _utils_dom__WEBPACK_IMPORTED_MODULE_3__.tx)(i++);
                  }
                }
                (0, _utils_cache__WEBPACK_IMPORTED_MODULE_4__.sA)();
              }
            }));
            sourceTracker.insertTrackersSelect(select);
          };
          (0, common_dom__WEBPACK_IMPORTED_MODULE_7__.$f)();
          main().catch((e => {
            (0, common_dom__WEBPACK_IMPORTED_MODULE_7__.x2)(e.message);
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
    97: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        G: () => getSettings
      });
      const defaultConfig = {
        onlyNewTitles: false,
        useCache: true,
        debug: false,
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
          },
          debug: {
            label: "Debug mode",
            type: "checkbox",
            default: defaultConfig.debug
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
        debug: GM_config.get("debug"),
        sizeDifferenceThreshold: GM_config.get("sizeDifferenceThreshold")
      });
    },
    387: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => Aither
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(933);
      var common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(257);
      var common_searcher__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(914);
      var common_trackers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(263);
      const parseCategory = element => {
        const categoryLink = element.querySelector(".torrent__category-link");
        if (!categoryLink) return;
        const categoryName = categoryLink.textContent?.trim();
        if ("TV" == categoryName) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.TV;
        if ("Movie" == categoryName) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE;
        return;
      };
      class Aither extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
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
          const elements = Array.from(document.querySelectorAll(".panelV2 tbody tr"));
          yield {
            total: elements.length
          };
          for (let element of elements) {
            let linkElement = element.querySelector(".torrent-search--list__name");
            const link = linkElement.href;
            let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_1__.uU)(link);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.VB)(response);
            const category = parseCategory(response);
            let torrentName = linkElement.textContent.trim();
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.GC)(torrentName);
            let size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__._8)(element.querySelector(".torrent-search--list__size").textContent.trim());
            const request = {
              torrents: [ {
                size,
                tags: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.RN)(torrentName),
                dom: element,
                resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.uV)(torrentName)
              } ],
              dom: [ element ],
              imdbId,
              title,
              year,
              category
            };
            yield request;
          }
        }
        name() {
          return "Aither";
        }
        async search(request) {
          if (request.category !== _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE && request.category !== _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.TV) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
          const result = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_3__.yC)(common_trackers__WEBPACK_IMPORTED_MODULE_4__.iep, {
            movie_title: "",
            movie_imdb_id: request.imdbId
          });
          if (result == common_searcher__WEBPACK_IMPORTED_MODULE_3__.lt.LOGGED_OUT) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_LOGGED_IN;
          return result == common_searcher__WEBPACK_IMPORTED_MODULE_3__.lt.NOT_FOUND ? _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.EXIST;
        }
        insertTrackersSelect(select) {
          const parent = document.querySelector(".panelV2 .panel__header");
          if (!parent) return;
          const div = document.createElement("div");
          select.style.width = "170px";
          div.classList.add("form__group");
          select.classList.add("form__select");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_5__.U_)(div, select);
          (0, common_dom__WEBPACK_IMPORTED_MODULE_5__.BE)(div, parent.querySelector("h2"));
        }
      }
    },
    168: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => AvistaZ
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(933);
      var common_searcher__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(914);
      var common_trackers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(263);
      class AvistaZ extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
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
          const rows = document.querySelectorAll("#content-area > div.block > .row");
          let elements = Array.from(rows);
          if (1 === rows.length) elements = Array.from(rows.item(0).children);
          yield {
            total: elements.length
          };
          for (let element of elements) {
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.VB)(element);
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.GC)(element.querySelector("a")?.getAttribute("title"));
            const request = {
              torrents: [ {
                dom: element
              } ],
              dom: [ element ],
              imdbId,
              title,
              year,
              category: _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE
            };
            yield request;
          }
        }
        name() {
          return "AvistaZ";
        }
        async search(request) {
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
          const result = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_2__.yC)(common_trackers__WEBPACK_IMPORTED_MODULE_3__.AT, {
            movie_title: "",
            movie_imdb_id: request.imdbId
          });
          if (result == common_searcher__WEBPACK_IMPORTED_MODULE_2__.lt.LOGGED_OUT) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_LOGGED_IN;
          return result == common_searcher__WEBPACK_IMPORTED_MODULE_2__.lt.NOT_FOUND ? _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.EXIST;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_4__.U_)(document.querySelector("#content-area > div.well.well-sm"), select);
        }
      }
    },
    472: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => BHD
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(933);
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(257);
      const parseTorrents = element => {
        const torrents = [];
        element.querySelectorAll('tr[id^="resulttorrent"]').forEach((torrentElement => {
          const data = torrentElement.children[0].textContent.trim().split("/");
          const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__._8)(torrentElement.children[4].textContent.trim());
          const tags = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.RN)(torrentElement.textContent);
          const torrent = {
            container: data[0].trim(),
            format: data[1].trim(),
            resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uV)(data[3].trim()),
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
        if (html.includes("categories/tv")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.TV; else if (html.includes("categories/movies")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.MOVIE;
        return;
      };
      const parseTorrentsFromTorrentsPage = () => {
        const requests = [];
        Array.from(document.querySelectorAll('tr[id^="torrentposter"]')).forEach((element => {
          let imdbId = null;
          let libraryId = element.getAttribute("library");
          if (libraryId) {
            let imdbElement = document.querySelector(`#librarydiv${libraryId}`);
            if (imdbElement) imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.VB)(imdbElement);
          }
          const tags = [];
          const torrentName = element.children[1].querySelector('a[id^="torrent"]').textContent;
          if (torrentName.toUpperCase().includes("REMUX")) tags.push("Remux");
          const torrent = {
            dom: element,
            size: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__._8)(element.children[5].textContent),
            tags,
            resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uV)(torrentName)
          };
          const torrents = [ torrent ];
          const request = {
            torrents,
            dom: [ element ],
            imdbId,
            title: "",
            category: parseCategory(element)
          };
          requests.push(request);
        }));
        return requests;
      };
      const parseTorrentsFromLibraryPage = () => {
        const requests = [];
        document.querySelectorAll(".bhd-meta-box").forEach((element => {
          let imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.VB)(element);
          const request = {
            torrents: parseTorrents(element),
            dom: [ element ],
            imdbId,
            title: ""
          };
          requests.push(request);
        }));
        return requests;
      };
      const isLibraryPage = () => window.location.href.includes("/library");
      const isTorrentsPage = () => window.location.href.includes("/torrents");
      class BHD extends _tracker__WEBPACK_IMPORTED_MODULE_1__.xw {
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
          if (isLibraryPage()) requests = parseTorrentsFromLibraryPage(); else if (isTorrentsPage()) requests = parseTorrentsFromTorrentsPage();
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.fM)(requests);
        }
        name() {
          return "BHD";
        }
        async search(request) {
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_1__.lt.NOT_CHECKED;
          const queryUrl = "https://beyond-hd.me/library/movies?activity=&q=" + request.imdbId;
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.uU)(queryUrl);
          return 0 === result.querySelectorAll(".bhd-meta-box").length ? _tracker__WEBPACK_IMPORTED_MODULE_1__.lt.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_1__.lt.EXIST;
        }
        insertTrackersSelect(select) {
          select.classList.add("beta-form-main");
          select.style.width = "170px";
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.Vt)(select, document.querySelector(".button-center"));
        }
      }
    },
    821: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => BLU
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(933);
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(257);
      class BLU extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
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
          let nodes = Array.from(document.querySelectorAll(".torrent-search--list__results tbody tr"));
          yield {
            total: nodes.length
          };
          for (let element of nodes) {
            let imdbId = "tt" + element.getAttribute("data-imdb-id");
            let size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__._8)(element.querySelector(".torrent-search--list__size").textContent);
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element
              } ],
              dom: [ element ],
              imdbId,
              title: ""
            };
            yield request;
          }
        }
        name() {
          return "BLU";
        }
        async search(request) {
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
          const queryUrl = "https://blutopia.xyz/torrents?perPage=25&imdbId=" + request.imdbId + "&sortField=size";
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.uU)(queryUrl);
          return null !== result.querySelector(".torrent-listings-no-result") ? _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.EXIST;
        }
        insertTrackersSelect(select) {
          select.classList.add("form__select");
          const wrapper = document.createElement("div");
          wrapper.classList.add("panel_action");
          wrapper.appendChild(select);
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.U_)(document.querySelectorAll(".panel__actions")[0], wrapper);
        }
      }
    },
    358: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => BTarg
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(933);
      var common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(257);
      const parseCategory = element => {
        const category = element.children[0].querySelector("a").href;
        if (category.includes("cat=02")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE;
        if (category.includes("cat=03")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.TV;
        if (category.includes("cat=05")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.XXX;
        if (category.includes("cat=08")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.LIVE_PERFORMANCE;
        return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.OTHER;
      };
      class BTarg extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
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
          const items = Array.from(document.querySelectorAll('tr a[href*="details.php?id"]')).filter((link => !link.href.includes("#") && link.href.includes("/details.php")));
          yield {
            total: items.length
          };
          for (const item of items) {
            let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_1__.uU)(item.href);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.rT)(response.textContent);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__._8)(item.parentElement?.nextElementSibling?.textContent);
            const request = {
              torrents: [ {
                size,
                dom: item.parentElement?.parentElement,
                tags: []
              } ],
              dom: [ item.parentElement?.parentElement, item.parentElement?.parentElement?.nextElementSibling ],
              imdbId,
              title: "",
              category: parseCategory(item.parentElement.parentElement)
            };
            yield request;
          }
        }
        name() {
          return "BTarg";
        }
        async search(request) {
          return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.BE)(select, document.querySelector('select[name="inclfree"]'));
        }
      }
    },
    284: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => CG
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(933);
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(257);
      const parseCategory = element => {
        const text = element.textContent.toLowerCase();
        if (text.includes("ebook")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.BOOK;
        return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE;
      };
      function parseTorrents(element) {
        const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__._8)(element.querySelector("td:nth-child(5)")?.textContent);
        let container;
        let format;
        let resolution = _tracker__WEBPACK_IMPORTED_MODULE_0__.GV.SD;
        const text = element.textContent.toLowerCase();
        if (text.includes("1080p")) resolution = _tracker__WEBPACK_IMPORTED_MODULE_0__.GV.FHD; else if (text.includes("720p")) resolution = _tracker__WEBPACK_IMPORTED_MODULE_0__.GV.HD; else if (text.includes("dvd-r")) format = "VOB IFO";
        return [ {
          size,
          tags: [],
          dom: element,
          resolution,
          container,
          format
        } ];
      }
      class CG extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
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
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.VB)(element);
            const category = parseCategory(element);
            const request = {
              torrents: parseTorrents(element),
              dom: [ element ],
              imdbId,
              title: "",
              category
            };
            requests.push(request);
          }));
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_0__.fM)(requests);
        }
        name() {
          return "CG";
        }
        async search(request) {
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
          const queryUrl = "https://cinemageddon.net/browse.php?search=" + request.imdbId + "&orderby=size&dir=DESC";
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.uU)(queryUrl);
          return result.textContent.includes("Nothing found!") ? _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.EXIST;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.U_)(document.querySelector(".embedded > p"), select);
        }
      }
    },
    435: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => CHD
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(933);
      var common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(257);
      var common_searcher__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(914);
      var common_trackers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(263);
      class CHD extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return true;
        }
        canRun(url) {
          return url.includes("ptchdbits.co") || url.includes("chddiy.xyz");
        }
        async* getSearchRequest() {
          let nodes = Array.from(document.querySelectorAll(".torrents")[0].children[0].children);
          yield {
            total: nodes.length
          };
          for (const element of nodes) {
            if (!element.querySelector(".torrentname")) continue;
            const link = element.querySelector('a[href*="details.php?id"]');
            if (!link) continue;
            let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_1__.uU)(link.href);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.VB)(response);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__._8)(element.querySelector(".rowfollow:nth-child(5)").textContent);
            let torrentName = element.querySelector(".torrentname a")?.getAttribute("title");
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.GC)(torrentName);
            const request = {
              torrents: [ {
                size,
                tags: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.RN)(torrentName),
                dom: element
              } ],
              dom: [ element ],
              imdbId,
              title,
              year
            };
            yield request;
          }
        }
        name() {
          return "CHD";
        }
        async search(request) {
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
          const result = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_3__.yC)(common_trackers__WEBPACK_IMPORTED_MODULE_4__._0y, {
            movie_title: "",
            movie_imdb_id: request.imdbId
          });
          if (result == common_searcher__WEBPACK_IMPORTED_MODULE_3__.lt.LOGGED_OUT) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_LOGGED_IN;
          return result == common_searcher__WEBPACK_IMPORTED_MODULE_3__.lt.NOT_FOUND ? _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.EXIST;
        }
        insertTrackersSelect(select) {
          const element = document.querySelector(".searchbox").children[2].querySelector("td td.rowfollow tr");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_5__.U_)(element, select);
        }
        waitTimeInMillisBetweenRequest() {
          return 5e3;
        }
      }
    },
    962: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => CLANSUD
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(933);
      var common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(257);
      class CLANSUD extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
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
          const topics = Array.from(document.querySelectorAll('div[data-tableid="topics"] table')).filter((topic => {
            if (null != topic.getAttribute("bgColor") && null != !topic.getAttribute("bgcolor")) return false;
            if (0 === topic.querySelectorAll("img").length) return false;
            if (3 != topic.querySelectorAll("img").length) return false;
            if ("peliscr.jpg" !== topic.querySelectorAll("img")[2].alt) {
              topic.style.display = "none";
              return false;
            }
            return true;
          }));
          yield {
            total: topics.length
          };
          for (const topic of topics) {
            const link = topic.querySelector("a").href;
            let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_1__.uU)(link);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.VB)(response);
            const fullTitle = topic.querySelectorAll("tr td")[1]?.textContent?.trim()?.split("\n")[0];
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.GC)(fullTitle);
            const request = {
              torrents: [ {
                resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.uV)(fullTitle),
                tags: [],
                dom: topic
              } ],
              dom: [ topic ],
              imdbId,
              title,
              year,
              category: _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE
            };
            yield request;
          }
        }
        name() {
          return "CLAN-SUD";
        }
        async search(request) {
          return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          const parent = document.querySelector('div[data-tableid="topics"]');
          if (parent) (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.Vt)(select, parent);
        }
      }
    },
    846: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => CinemaZ
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(933);
      var common_searcher__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(914);
      var common_trackers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(263);
      class CinemaZ extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
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
          const rows = document.querySelectorAll("#content-area > div.block > .row");
          let elements = Array.from(rows);
          if (1 === rows.length) elements = Array.from(rows.item(0).children);
          yield {
            total: elements.length
          };
          for (let element of elements) {
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.VB)(element);
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.GC)(element.querySelector("a")?.getAttribute("title"));
            const request = {
              torrents: [ {
                dom: element
              } ],
              dom: [ element ],
              imdbId,
              title,
              year,
              category: _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE
            };
            yield request;
          }
        }
        name() {
          return "CinemaZ";
        }
        async search(request) {
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
          const result = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_2__.yC)(common_trackers__WEBPACK_IMPORTED_MODULE_3__.CZ, {
            movie_title: "",
            movie_imdb_id: request.imdbId
          });
          if (result == common_searcher__WEBPACK_IMPORTED_MODULE_2__.lt.LOGGED_OUT) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_LOGGED_IN;
          return result == common_searcher__WEBPACK_IMPORTED_MODULE_2__.lt.NOT_FOUND ? _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.EXIST;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_4__.U_)(document.querySelector("#content-area > div.well.well-sm"), select);
        }
      }
    },
    134: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => DiscFan
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(933);
      var common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(257);
      class DiscFan extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return false;
        }
        canRun(url) {
          return url.includes("https://discfan.net");
        }
        async* getSearchRequest() {
          let elements = Array.from(document.querySelectorAll(".torrents")[0].children[0].children).filter((element => element.querySelector(".torrentname")));
          yield {
            total: elements.length
          };
          for (const element of elements) {
            const link = element.querySelector('a[href*="details.php?id"]');
            if (!link) continue;
            let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_1__.uU)(link.href);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.VB)(response);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__._8)(element.children[4]?.textContent);
            const fullTitle = element.querySelector(".torrentname a")?.textContent;
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.GC)(fullTitle);
            const request = {
              torrents: [ {
                size,
                tags: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.RN)(fullTitle),
                resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.uV)(fullTitle),
                dom: element
              } ],
              dom: [ element ],
              imdbId,
              title,
              year
            };
            yield request;
          }
        }
        name() {
          return "DiscFan";
        }
        async search(request) {
          return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          const element = document.querySelector(".searchbox")?.children[2].querySelector("td td.rowfollow tr");
          if (element) (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.U_)(element, select);
        }
      }
    },
    245: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => FL
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(933);
      var common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(257);
      class FL extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
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
          let nodes = Array.from(document.querySelectorAll(".torrentrow"));
          yield {
            total: nodes.length
          };
          for (const element of nodes) {
            const link = element.querySelector('a[href*="details.php?id"]');
            if (!link) continue;
            let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_1__.uU)(link.href);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.VB)(response);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__._8)(element.querySelector(".torrenttable:nth-child(7)")?.textContent);
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element
              } ],
              dom: [ element ],
              imdbId,
              title: ""
            };
            yield request;
          }
        }
        name() {
          return "FL";
        }
        async search(request) {
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
          const queryUrl = "https://filelist.io/browse.php?search=" + request.imdbId + "&cat=0&searchin=1&sort=3";
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_1__.uU)(queryUrl);
          return 0 === result.querySelectorAll(".torrentrow").length ? _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.EXIST;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.U_)(document.querySelector("form p"), select);
        }
      }
    },
    219: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => GPW
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(933);
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(257);
      class GPW extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return true;
        }
        canRun(url) {
          return url.includes("greatposterwall.com") && !url.includes("id=");
        }
        async* getSearchRequest() {
          const elements = document.querySelectorAll("#torrent_table tr.TableTorrent-rowMovieInfo");
          yield {
            total: elements.length
          };
          for (let element of Array.from(elements)) {
            let imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.VB)(element);
            const groupId = element.getAttribute("group-id");
            const torrents = [];
            if (groupId) {
              const torrentElements = document.querySelectorAll(`tr.TableTorrent-rowTitle[group-id="${groupId}"]`);
              for (const torrentElement of Array.from(torrentElements)) {
                const torrentTtitle = torrentElement.querySelector("span.TorrentTitle")?.textContent;
                const tags = [];
                if (torrentTtitle?.includes("Remux")) tags.push("Remux");
                let container;
                const containerElement = torrentElement.querySelector("span.TorrentTitle-item.codec");
                if (containerElement) container = containerElement?.textContent?.trim();
                const torrent = {
                  container,
                  dom: torrentElement,
                  format: "",
                  resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.uV)(torrentElement.querySelector("span.TorrentTitle-item.resolution")?.textContent?.trim()),
                  size: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__._8)(torrentElement.querySelector("td.TableTorrent-cellStatSize")?.textContent),
                  tags
                };
                torrents.push(torrent);
              }
            }
            const request = {
              torrents,
              dom: [ element ],
              imdbId,
              title: ""
            };
            yield request;
          }
        }
        name() {
          return "GPW";
        }
        async search(request) {
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
          const queryUrl = `https://greatposterwall.com/torrents.php?groupname=${request.imdbId}`;
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.uU)(queryUrl);
          return null !== result.querySelector(".torrent-listings-no-result") ? _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.EXIST;
        }
        insertTrackersSelect(select) {
          select.classList.add("Input");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.U_)(document.querySelector(".SearchPageFooter-actions"), select);
        }
      }
    },
    468: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => HDB
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(933);
      var common_logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(616);
      var common_searcher__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(914);
      var common_trackers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(263);
      const isExclusive = element => {
        const exclusiveLink = element.querySelector('a[href="/browse.php?exclusive=1"]');
        return null != exclusiveLink;
      };
      function parseTorrent(element) {
        const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__._8)(element.querySelector("td:nth-child(6)")?.textContent);
        const title = element.querySelector(".browse_td_name_cell a")?.textContent?.trim();
        const resolution = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uV)(title);
        const tags = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.RN)(title);
        return {
          size,
          tags,
          dom: element,
          resolution
        };
      }
      function parseCategory(element) {
        const category = element.querySelector(".catcell a")?.getAttribute("href")?.replace("?cat=", "");
        switch (category) {
         case "1":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.MOVIE;

         case "2":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.TV;

         case "3":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.DOCUMENTARY;

         case "4":
         case "6":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.MUSIC;

         case "5":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.SPORT;

         case "7":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.XXX;
        }
      }
      class HDB extends _tracker__WEBPACK_IMPORTED_MODULE_1__.xw {
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
          const elements = Array.from(document.querySelectorAll("#torrent-list > tbody tr"));
          yield {
            total: elements.length
          };
          for (let element of elements) try {
            if (isExclusive(element)) {
              element.style.display = "none";
              yield null;
              continue;
            }
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.rT)(element.querySelector("a[data-imdb-link]")?.getAttribute("data-imdb-link"));
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.GC)(element.children[2].querySelector("a")?.textContent);
            yield {
              torrents: [ parseTorrent(element) ],
              dom: [ element ],
              imdbId,
              title,
              year,
              category: parseCategory(element)
            };
          } catch (e) {
            console.trace(e);
            common_logger__WEBPACK_IMPORTED_MODULE_2__.k.info("[{0}] Error occurred while parsing torrent: " + e, this.name());
            yield {
              torrents: [],
              dom: [ element ]
            };
          }
        }
        name() {
          return "HDB";
        }
        async search(request) {
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_1__.lt.NOT_CHECKED;
          const result = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_3__.yC)(common_trackers__WEBPACK_IMPORTED_MODULE_4__.N24, {
            movie_title: "",
            movie_imdb_id: request.imdbId
          });
          if (result == common_searcher__WEBPACK_IMPORTED_MODULE_3__.lt.LOGGED_OUT) return _tracker__WEBPACK_IMPORTED_MODULE_1__.lt.NOT_LOGGED_IN;
          return result == common_searcher__WEBPACK_IMPORTED_MODULE_3__.lt.NOT_FOUND ? _tracker__WEBPACK_IMPORTED_MODULE_1__.lt.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_1__.lt.EXIST;
        }
        insertTrackersSelect(select) {
          const targetElement = document.querySelector("#moresearch3 > td:nth-child(2)");
          if (targetElement) {
            targetElement.innerHTML += "<br><br>Find unique for:<br>";
            (0, common_dom__WEBPACK_IMPORTED_MODULE_5__.U_)(targetElement, select);
          } else common_logger__WEBPACK_IMPORTED_MODULE_2__.k.info("[{0}] Can add search select", this.name());
        }
      }
    },
    124: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => HDSky
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(933);
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(257);
      class HDSky extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
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
          let elements = Array.from(document.querySelectorAll(".torrents")[0].children[0].children);
          for (const element of elements) {
            if (!element.querySelector(".torrentname")) continue;
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.VB)(element.querySelector(".torrentname"));
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__._8)(element.children[6]?.textContent);
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element
              } ],
              dom: [ element ],
              imdbId,
              title: ""
            };
            yield request;
          }
        }
        name() {
          return "HDSky";
        }
        async search(request) {
          if (request.category === _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE) {
            const movieRequest = request;
            const queryUrl = "https://hdsky.me/torrents.php?seeders=&medium13=1&medium1=1&incldead=0&spstate=0&inclbookmarked=0&search=" + movieRequest.imdbId + "&search_area=4&search_mode=0";
            const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.uU)(queryUrl);
            let notFound = null === result.querySelector(".torrentname");
            if (notFound) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_EXIST;
            return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.EXIST;
          }
        }
        insertTrackersSelect(select) {
          const element = document.querySelector(".searchbox").children[2].querySelector("td td.rowfollow tr");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.U_)(element, select);
        }
      }
    },
    597: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => HDT
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(933);
      class HDT extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
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
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.VB)(element.closest("td"));
            let line = element.closest("tr");
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__._8)(line.children[7]?.textContent);
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element
              } ],
              dom: [ line ],
              imdbId,
              title: ""
            };
            requests.push(request);
          }));
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_0__.fM)(requests);
        }
        name() {
          return "HDT";
        }
        async search(request) {
          return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          const element = document.querySelectorAll(".mainblockcontentsearch tr")[2];
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.U_)(element, select);
        }
      }
    },
    991: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => CG
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(933);
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(257);
      const parseCategory = element => {
        let categoryImg = element.children[0].querySelector("img");
        const categoryLogo = categoryImg.src;
        const alt = categoryImg.alt;
        if (categoryLogo.includes("Movies-") || alt.includes("Movie")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE;
        if (categoryLogo.includes("TV-")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.TV;
        if (categoryLogo.includes("Music-")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MUSIC;
      };
      class CG extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return false;
        }
        canRun(url) {
          return url.includes("ptorrents.com/t?");
        }
        async* getSearchRequest() {
          const elements = Array.from(document.querySelectorAll("#torrents tbody tr"));
          yield {
            total: elements.length
          };
          for (let element of elements) {
            const category = parseCategory(element);
            let request = {
              dom: [ element ],
              category
            };
            const link = element.children[1].querySelector("a");
            const torrentTitle = link?.textContent;
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__._8)(element.children[5].textContent);
            if (category == _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE) {
              let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.uU)(link.href);
              const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.VB)(response);
              const {year, title} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.GC)(torrentTitle);
              request = {
                ...request,
                torrents: [ {
                  dom: element,
                  size,
                  resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.uV)(torrentTitle),
                  tags: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.RN)(torrentTitle)
                } ],
                year,
                imdbId,
                title
              };
            } else if (category == _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MUSIC) {
              const splittedTitle = torrentTitle.split("-");
              const artists = [ splittedTitle[0] ];
              const titles = [ splittedTitle[1] ];
              const year = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.SH)(torrentTitle);
              const {container, format} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.mp)(torrentTitle);
              request = {
                ...request,
                torrents: [ {
                  dom: element,
                  size,
                  format,
                  container
                } ],
                artists,
                titles,
                year,
                type: _tracker__WEBPACK_IMPORTED_MODULE_0__.kk.ALBUM
              };
            }
            yield request;
          }
        }
        name() {
          return "IPT";
        }
        async search(request) {
          return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.BE)(select, document.querySelector('input[name="q"]'));
        }
      }
    },
    407: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => JPTV
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(933);
      var common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(257);
      var common_logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(616);
      var common_searcher__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(914);
      class JPTV extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
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
          let nodes = Array.from(document.querySelectorAll(".view-torrent"));
          yield {
            total: nodes.length
          };
          for (const element of nodes) {
            let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_1__.uU)(element.href);
            let imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.VB)(response);
            if (!imdbId) {
              const tmdb = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.lL)(response);
              if (tmdb) {
                common_logger__WEBPACK_IMPORTED_MODULE_3__.k.debug("{0} Will try find ImdbId from TmdbId {1}", this.name(), tmdb);
                imdbId = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_4__.It)(tmdb);
              }
            }
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__._8)(element?.parentElement?.parentElement?.children[7]?.textContent?.trim());
            let torrentTitle = element.textContent.trim();
            let {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.GC)(response.querySelector("h1.movie-heading")?.textContent?.replaceAll(/\s+/g, " ")?.trim());
            if (!title) {
              const titleAndYear = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.GC)(torrentTitle);
              if (titleAndYear) {
                title = titleAndYear.title;
                year = titleAndYear.year;
              }
            }
            const request = {
              torrents: [ {
                size,
                tags: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.RN)(torrentTitle),
                resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.uV)(torrentTitle),
                container: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Ji)(torrentTitle),
                releaseGroup: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.ds)(torrentTitle),
                dom: element?.parentElement?.parentElement
              } ],
              dom: [ element ],
              imdbId,
              title,
              year
            };
            yield request;
          }
        }
        name() {
          return "JPTV";
        }
        async search(request) {
          return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          if (window.location.toString().indexOf("/filter") > -1) (0, common_dom__WEBPACK_IMPORTED_MODULE_5__.U_)(document.querySelector("ul.pagination"), select); else (0, 
          common_dom__WEBPACK_IMPORTED_MODULE_5__.U_)(document.querySelector(".form-torrent-search"), select);
        }
      }
    },
    196: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => JPop
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(933);
      const parseYear = element => {
        const text = element.children[3].textContent.trim();
        const match = text.match(/\[(\d{4})(\.\d{2}\.\d{2})?]/);
        return match ? parseInt(match[1]) : null;
      };
      const parseType = element => {
        const type = element.children[1].textContent.trim();
        if ("Album" == type) return _tracker__WEBPACK_IMPORTED_MODULE_0__.kk.ALBUM;
        if ("TV-Music" == type) return _tracker__WEBPACK_IMPORTED_MODULE_0__.kk.TV_MUSIC;
        return null;
      };
      const parseTorrents = element => {
        if (element.classList.contains("torrent_redline")) {
          const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__._8)(element.children[6].textContent);
          const {format, container} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.mp)(element.children[3].textContent.trim());
          return [ {
            size,
            dom: element,
            format,
            container
          } ];
        } else {
          const groupId = element.querySelector('a[title*="View Torrent"]').href.split("id=")[1];
          return Array.from(document.querySelectorAll(`tr.groupid_${groupId}`)).map((element => {
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__._8)(element.children[3].textContent);
            const {format, container} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.mp)(element.children[0].textContent.trim());
            return {
              size,
              dom: element,
              format,
              container
            };
          }));
        }
      };
      const parseArtist = element => {
        const artists = new Set;
        artists.add(element.textContent?.trim());
        const title = element.getAttribute("title").split(" (View Artist)");
        if (2 == title.length) artists.add(title[0].trim());
        return Array.from(artists);
      };
      const parseAlbum = element => {
        const titles = new Set;
        titles.add(element.textContent?.trim());
        const title = element.getAttribute("title").split(" (View Torrent)");
        if (2 == title.length) titles.add(title[0].trim());
        return Array.from(titles);
      };
      class JPop extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return false;
        }
        canRun(url) {
          return url.includes("jpopsuki.eu");
        }
        async* getSearchRequest() {
          const elements = Array.from(document.querySelectorAll(".group_redline, .torrent_redline"));
          yield {
            total: elements.length
          };
          for (const element of elements) {
            const artists = parseArtist(element.querySelector('a[title*="View Artist"]'));
            const titles = parseAlbum(element.querySelector('a[title*="View Torrent"]'));
            const year = parseYear(element);
            const type = parseType(element);
            const torrents = parseTorrents(element);
            const request = {
              torrents,
              dom: [ element ],
              titles,
              artists,
              type,
              year,
              category: _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MUSIC
            };
            yield request;
          }
        }
        name() {
          return "JPop";
        }
        async search(request) {
          return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          const element = document.querySelector('div.submit input[type="submit"]');
          if (element) (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.Vt)(select, element);
        }
      }
    },
    522: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => KG
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(933);
      var common_searcher__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(914);
      var common_trackers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(263);
      const parseCategory = element => {
        const category = _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE;
        let img = element.querySelectorAll("td img")[0];
        const imageSrc = img.getAttribute("src");
        if (imageSrc?.includes("40.jpg")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.AUDIOBOOK;
        if (imageSrc?.includes("41.jpg")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.BOOK;
        if (img.getAttribute("title")?.includes("Music")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MUSIC;
        return category;
      };
      const parseTitleAndYear = element => {
        const year = parseInt(element.children[3].textContent.trim(), 10);
        const title = element.children[1].querySelector("a").textContent.trim();
        return {
          title,
          year
        };
      };
      const parseTorrent = element => {
        const torrents = [];
        const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__._8)(element.querySelector("td:nth-child(11)")?.textContent?.replace(",", ""));
        let resolution;
        let format;
        if (element.querySelector('td img[src*="hdrip1080.png"]')) resolution = _tracker__WEBPACK_IMPORTED_MODULE_0__.GV.FHD; else if (element.querySelector('td img[src*="hdrip720.png"]')) resolution = _tracker__WEBPACK_IMPORTED_MODULE_0__.GV.HD; else if (element.querySelector('td img[src*="dvdr.png"]')) {
          resolution = _tracker__WEBPACK_IMPORTED_MODULE_0__.GV.SD;
          format = "VOB IFO";
        } else if (element.querySelector('td img[src*="bluray.png"]')) {
          resolution = _tracker__WEBPACK_IMPORTED_MODULE_0__.GV.FHD;
          format = "m2ts";
        }
        torrents.push({
          size,
          format,
          tags: [],
          resolution,
          dom: element
        });
        return torrents;
      };
      class KG extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
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
          let elements = Array.from(document.querySelectorAll("#browse > tbody tr")).filter((element => null != element.querySelector("td:nth-child(2) > div > span:nth-child(1)")));
          yield {
            total: elements.length
          };
          for (let element of elements) {
            let linksContainer = element.querySelector("td:nth-child(2) > div > span:nth-child(1)");
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.VB)(linksContainer);
            let torrents = parseTorrent(element);
            const {year, title} = parseTitleAndYear(element);
            const request = {
              torrents,
              dom: [ element ],
              imdbId,
              title,
              year,
              category: parseCategory(element)
            };
            yield request;
          }
        }
        name() {
          return "KG";
        }
        async search(request) {
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
          const result = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_2__.yC)(common_trackers__WEBPACK_IMPORTED_MODULE_3__.KG, {
            movie_title: "",
            movie_imdb_id: request.imdbId
          });
          if (result == common_searcher__WEBPACK_IMPORTED_MODULE_2__.lt.LOGGED_OUT) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_LOGGED_IN;
          return result == common_searcher__WEBPACK_IMPORTED_MODULE_2__.lt.NOT_FOUND ? _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.EXIST;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_4__.Vt)(select, document.getElementById("showdead"));
        }
      }
    },
    143: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => LatTeam
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(933);
      const parseCategory = element => {
        const icon = element.querySelector(".torrent-search--list__category i");
        if (!icon) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.OTHER;
        if (icon?.classList.contains("fa-film")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE;
        if (icon?.classList.contains("fa-tv-retro")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.TV;
        return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.OTHER;
      };
      class LatTeam extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return false;
        }
        canRun(url) {
          return url.includes("lat-team.com");
        }
        async* getSearchRequest() {
          const rows = document.querySelectorAll(".torrent-search--list__results tbody tr");
          let elements = Array.from(rows);
          yield {
            total: elements.length
          };
          for (let element of elements) {
            const imdbId = element.getAttribute("data-imdb-id");
            let fullTitle = element.querySelector("a.torrent-search--list__name")?.textContent?.trim();
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.GC)(fullTitle);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__._8)(element.querySelector(".torrent-search--list__size")?.textContent?.trim());
            const tags = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.RN)(fullTitle);
            const category = parseCategory(element);
            const resolution = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.uV)(element.querySelector(".torrent-search--list__resolution")?.textContent?.trim());
            const request = {
              torrents: [ {
                dom: element,
                size,
                tags,
                resolution,
                container: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Ji)(fullTitle)
              } ],
              dom: [ element ],
              imdbId,
              title,
              year,
              category
            };
            yield request;
          }
        }
        name() {
          return "LatTeam";
        }
        insertTrackersSelect(select) {
          select.classList.add("form__select");
          select.style.width = "180px";
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.U_)(document.querySelector(".panelV2.torrent-search__results .panel__actions"), select);
        }
      }
    },
    422: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => MTV
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(933);
      var common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(257);
      var common_searcher__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(914);
      var common_trackers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(263);
      const parseCategory = element => {
        const movieBanner = element.querySelector('div[title="hd.movie"]');
        if (movieBanner) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE;
        return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.TV;
      };
      const parseYearAndTitle = htmlElement => {
        const pageTitle = htmlElement.querySelector("#content h2")?.textContent?.trim();
        if (pageTitle) {
          const regex = /^(.*?)\s*\((\d{4})\)\s*-/;
          const match = pageTitle.match(regex);
          if (match) {
            const title = match[1].trim();
            const year = parseInt(match[2], 10);
            return {
              title,
              year
            };
          }
        }
        return {
          title: void 0,
          year: void 0
        };
      };
      class MTV extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return true;
        }
        canRun(url) {
          return url.includes("morethantv.me");
        }
        async* getSearchRequest() {
          let nodes = document.querySelectorAll("tr.torrent");
          yield {
            total: nodes.length
          };
          for (const element of nodes) {
            const category = parseCategory(element);
            let imdbId = null;
            let title;
            let year;
            if (category == _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE) {
              const link = element.querySelector('td a[href*="torrents.php?id="]');
              let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_1__.uU)(link.href);
              imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.VB)(response);
              ({title, year} = parseYearAndTitle(response));
            }
            let sizeText = element.children[4]?.textContent;
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__._8)(sizeText);
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element
              } ],
              dom: [ element ],
              imdbId,
              title,
              year,
              category
            };
            yield request;
          }
        }
        name() {
          return "MTV";
        }
        async search(request) {
          let result;
          if (request.category == _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE) result = await (0, 
          common_searcher__WEBPACK_IMPORTED_MODULE_3__.yC)(common_trackers__WEBPACK_IMPORTED_MODULE_4__.FvT, {
            movie_title: request.title
          }); else result = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_3__.yC)(common_trackers__WEBPACK_IMPORTED_MODULE_4__.YE3, {
            movie_title: request.title
          });
          return result == common_searcher__WEBPACK_IMPORTED_MODULE_3__.lt.NOT_FOUND ? _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.EXIST;
        }
        insertTrackersSelect(select) {
          const wrapper = document.createElement("tr");
          const label = document.createElement("td");
          const selectTd = document.createElement("td");
          label.textContent = "Find Unique for:";
          label.classList.add("label");
          selectTd.appendChild(select);
          wrapper.appendChild(label);
          wrapper.appendChild(selectTd);
          (0, common_dom__WEBPACK_IMPORTED_MODULE_5__.U_)(document.querySelector("#search_box table.noborder tbody"), wrapper);
        }
      }
    },
    286: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => MTeam
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(933);
      const isTV = title => {
        const tvPatterns = [ /S\d{2}E\d{2}/i, /S\d{2}/i, /EP\d{2,3}/i ];
        return tvPatterns.some((pattern => pattern.test(title)));
      };
      const getCategory = element => {
        let categoryTitle = element.querySelector("img")?.getAttribute("title")?.toLocaleLowerCase();
        if (categoryTitle?.includes("anime")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.ANIME;
        if (categoryTitle?.includes("misc")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.OTHER;
        const title = element.querySelector(".torrentname a")?.getAttribute("title");
        let category = _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE;
        if (title && isTV(title)) category = _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.TV;
        return category;
      };
      class MTeam extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
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
          let elements = Array.from(document.querySelectorAll(".torrents")[0].children[0].children).filter((element => element.querySelector(".torrentname")));
          yield {
            total: elements.length
          };
          for (const element of elements) {
            let imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.VB)(element.querySelector(".torrentname"));
            if (imdbId) imdbId = imdbId.replace("tt0", "tt");
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__._8)(element.children[6]?.textContent);
            const fullTitle = element.querySelector(".torrentname a")?.getAttribute("title");
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.GC)(fullTitle);
            let category = getCategory(element);
            const request = {
              torrents: [ {
                size,
                tags: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.RN)(fullTitle),
                resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.uV)(fullTitle),
                dom: element
              } ],
              dom: [ element ],
              imdbId,
              title,
              year,
              category
            };
            yield request;
          }
        }
        name() {
          return "M-Team";
        }
        async search(request) {
          return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          const element = document.querySelector(".searchbox")?.children[2].querySelector("td td.rowfollow tr");
          if (element) (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.U_)(element, select);
        }
      }
    },
    614: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => NewInsane
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(933);
      class NewInsane extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
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
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.VB)(element);
            const request = {
              torrents: [],
              dom: [ element ],
              imdbId,
              title: ""
            };
            requests.push(request);
          }));
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_0__.fM)(requests);
        }
        name() {
          return "NewInsane";
        }
        async search(request) {
          return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.U_)(document.querySelector(".searchbuttons.actiontitle"), select);
        }
      }
    },
    961: (module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.a(module, (async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
        try {
          __webpack_require__.d(__webpack_exports__, {
            Z: () => PTP
          });
          var _utils_cache__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(698);
          var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(657);
          var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
          var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(933);
          var common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(257);
          var common_logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(616);
          var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([ _utils_cache__WEBPACK_IMPORTED_MODULE_5__ ]);
          _utils_cache__WEBPACK_IMPORTED_MODULE_5__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
          const BANNED_RELEASE_GROUPS = [ "aXXo", "BMDRu", "BRrip", "CM8", "CrEwSaDe", "CTFOH", "d3g", "DNL", "FaNGDiNG0", "HD2DVD", "HDTime", "ION10", "iPlanet", "KiNGDOM", "mHD", "mSD", "nHD", "nikt0", "nSD", "NhaNc3", "OFT", "PRODJi", "SANTi", "SPiRiT", "STUTTERSHIT", "ViSION", "VXT", "WAF", "x0r", "YIFY", "OFT", "BHDStudio", "nikt0", "HDT", "LAMA", "WORLD", "SasukeducK", "SPiRiT" ];
          function isSupportedCategory(category) {
            return void 0 === category || category === _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE || category === _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.DOCUMENTARY || category === _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.LIVE_PERFORMANCE;
          }
          const parseTorrents = element => {
            const torrents = [];
            if (element.classList.contains("cover-movie-list__movie")) return [];
            element.querySelectorAll("tr.basic-movie-list__torrent-row").forEach((element => {
              if (element.querySelector(".basic-movie-list__torrent-edition")) return;
              const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__._8)(element.children[2].textContent);
              let title = element.querySelector(".torrent-info-link").textContent;
              const resolution = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.uV)(title);
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
            if (categoryTitle.includes("Stand-up Comedy ")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.STAND_UP; else if (categoryTitle.includes("Live Performance ")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.LIVE_PERFORMANCE; else return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE;
          };
          const hasRequests = element => true === element.querySelector("#no_results_message")?.textContent?.trim().includes("Your search did not match any torrents, however it did match these requests.");
          const isAllowedTorrent = torrent => {
            if ("x265" === torrent.container && torrent.resolution !== _tracker__WEBPACK_IMPORTED_MODULE_0__.GV.UHD && !isHDR(torrent)) {
              common_logger__WEBPACK_IMPORTED_MODULE_2__.k.debug("[PTP] Torrent not allowed: non HDR X265 and not 2160p");
              return false;
            }
            if (BANNED_RELEASE_GROUPS.includes(torrent.releaseGroup)) {
              common_logger__WEBPACK_IMPORTED_MODULE_2__.k.debug(`[PTP] Torrent not allowed: banned release group: ${torrent.releaseGroup}`);
              return false;
            }
            return true;
          };
          class PTP extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
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
              const nodes = (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.Ew)(document.body, "#torrents-movie-view table.torrent_table > tbody", "table.torrent_table > tbody tr.basic-movie-list__details-row", ".cover-movie-list__movie");
              yield {
                total: nodes.length
              };
              for (let element of nodes) {
                let elements = (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.Ew)(element, ".basic-movie-list__movie__ratings-and-tags", ".cover-movie-list__movie__rating-and-tags");
                const imdbId = elements ? (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.VB)(elements[0]) : null;
                const request = {
                  torrents: parseTorrents(element),
                  dom: [ element ],
                  imdbId,
                  title: "",
                  category: parseCategory(element)
                };
                yield request;
              }
            }
            name() {
              return "PTP";
            }
            async search(request) {
              if (!this.isAllowed(request)) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_ALLOWED;
              if (0 === request.torrents.filter((torrent => isAllowedTorrent(torrent))).length) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_ALLOWED;
              let torrents = [];
              let result;
              const moviesRequest = request;
              if (!moviesRequest.imdbId) {
                common_logger__WEBPACK_IMPORTED_MODULE_2__.k.debug("NO IMDB ID was provided");
                if (moviesRequest.title && moviesRequest.year) {
                  common_logger__WEBPACK_IMPORTED_MODULE_2__.k.debug("Searching by title and year: {0} - {1}", moviesRequest.title, moviesRequest.year);
                  const query_url = `https://passthepopcorn.me/torrents.php?action=advanced&searchstr=${encodeURIComponent(moviesRequest.title)}&year=${moviesRequest.year}`;
                  result = await (0, common_http__WEBPACK_IMPORTED_MODULE_4__.uU)(query_url);
                  let searchResultsCount = result.querySelector("span.search-form__footer__results");
                  if (searchResultsCount && "0" !== searchResultsCount.textContent?.trim()?.split(" ")[0]) {
                    common_logger__WEBPACK_IMPORTED_MODULE_2__.k.debug("[PTP] Multiple results found: {0}", searchResultsCount.textContent);
                    const torrentsData = extractJsonData(result);
                    for (let movie of torrentsData.Movies) {
                      common_logger__WEBPACK_IMPORTED_MODULE_2__.k.debug("[PTP] Found search result: {0}", movie);
                      if (movie.Title.trim() === moviesRequest.title && parseInt(movie.Year.trim()) === moviesRequest.year) {
                        common_logger__WEBPACK_IMPORTED_MODULE_2__.k.debug("[PTP] Found a title with 100% match");
                        for (let group of movie.GroupingQualities) for (let torrent of group.Torrents) torrents.push({
                          size: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__._8)(torrent.Size),
                          tags: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.RN)(torrent.Title),
                          resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.uV)(torrent.Title),
                          container: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Ji)(torrent.Title)
                        });
                        common_logger__WEBPACK_IMPORTED_MODULE_2__.k.debug("[PTP] Parsed torrents: {0}", torrents);
                        break;
                      }
                    }
                  } else torrents = parseAvailableTorrents(result);
                } else return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
              } else {
                torrents = (0, _utils_cache__WEBPACK_IMPORTED_MODULE_5__.hW)(moviesRequest.imdbId);
                if (!torrents) {
                  const query_url = "https://passthepopcorn.me/torrents.php?imdb=" + moviesRequest.imdbId;
                  result = await (0, common_http__WEBPACK_IMPORTED_MODULE_4__.uU)(query_url);
                  torrents = parseAvailableTorrents(result);
                  (0, _utils_cache__WEBPACK_IMPORTED_MODULE_5__._h)(moviesRequest.imdbId, torrents);
                }
              }
              let notFound = !torrents.length;
              if (notFound) {
                if (result && hasRequests(result)) if (moviesRequest.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_EXIST_WITH_REQUEST; else return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.MAYBE_NOT_EXIST_WITH_REQUEST;
                if (moviesRequest.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_EXIST; else return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.MAYBE_NOT_EXIST;
              }
              let searchResult = _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.EXIST;
              for (let torrent of moviesRequest.torrents) if (searchTorrent(torrent, torrents)) searchResult = _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.EXIST_BUT_MISSING_SLOT; else torrent.dom.style.display = "none";
              return searchResult;
            }
            isAllowed(request) {
              if (!isSupportedCategory(request.category)) return false;
              return true;
            }
            insertTrackersSelect(select) {
              let element = document.querySelector(".search-form__footer__buttons");
              if (!element) return;
              (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.Vt)(select, element);
            }
          }
          const parseAvailableTorrents = result => {
            const lines = Array.from(result.querySelectorAll('#torrent-table tr[id^="group_torrent_header_"]'));
            return parseTorrentsFromLines(lines);
          };
          const parseTorrentsFromLines = lines => {
            const torrents = [];
            for (let line of lines) {
              const data = line.children[0]?.textContent?.trim().split("/");
              const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__._8)(line.children[1]?.textContent?.trim());
              const tags = [];
              if (line.textContent?.includes("Remux")) tags.push("Remux");
              const torrent = {
                container: data[0].split("]")[1].trim(),
                format: data[1].trim(),
                resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.uV)(data[3].trim()),
                tags,
                size,
                dom: line
              };
              torrents.push(torrent);
            }
            return torrents;
          };
          function sameContainer(first, second) {
            return first === second || "H.264" === first && "x264" === second || "x264" === first && "H.264" === second || "H.265" === first && "x265" === second || "x265" === first && "H.265" === second || "UHD100" === first && "BD100" === second || "BD100" === first && "UHD100" === second || "UHD66" === first && "BD66" === second || "BD66" === first && "UHD66" === second;
          }
          function sameResolution(first, second) {
            if (!first.resolution || !second.resolution) return true;
            return first.resolution === second.resolution;
          }
          const isHDR = torrent => torrent.tags?.includes("HDR") || torrent.tags?.includes("DV");
          const searchTorrent = (torrent, availableTorrents) => {
            const similarTorrents = availableTorrents.filter((e => sameResolution(torrent, e) && (void 0 === torrent.container || sameContainer(e.container, torrent.container)) && (!torrent.tags?.includes("Remux") || e.tags?.includes("Remux"))));
            if (0 == similarTorrents.length && torrent.resolution && torrent.container) return true;
            if (1 == similarTorrents.length) if (torrent.size > 1.5 * similarTorrents[0].size || similarTorrents[0].size > 1.5 * torrent.size) return true;
            return false;
          };
          function extractJsonData(doc) {
            const scriptElements = Array.from(doc.querySelectorAll("script"));
            for (const scriptElement of scriptElements) {
              let scriptContent = scriptElement.textContent.trim();
              if (scriptContent.includes("PageData")) {
                const startIndex = scriptContent.indexOf("var PageData =") + 14;
                const jsonVariable = scriptContent.substring(startIndex, scriptContent.length - 1);
                try {
                  return JSON.parse(jsonVariable);
                } catch (error) {
                  console.error("Error extracting JSON:", error);
                  return null;
                }
              }
            }
            console.error("No script element containing PageData found.");
            return null;
          }
          __webpack_async_result__();
        } catch (e) {
          __webpack_async_result__(e);
        }
      }));
    },
    283: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => Pter
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(933);
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(257);
      function parseTorrent(element) {
        const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__._8)(element.childNodes[6].textContent);
        const title = element.querySelector(".torrentname a").textContent.trim();
        let resolution = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uV)(title);
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
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.MOVIE;

         case "402":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.DOCUMENTARY;

         case "403":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.ANIME;

         case "404":
         case "405":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.TV;

         case "406":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.MUSIC;

         case "407":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.SPORT;

         case "408":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.BOOK;

         case "409":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.GAME;

         case "411":
          {
            const source = element.children[0].children[1].querySelector("img").getAttribute("title").toLocaleUpperCase();
            switch (source) {
             case "PDF":
             case "MOBI":
             case "EPUB":
              return _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.BOOK;
            }
            return null;
          }

         case "413":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.MV;

         case "418":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.LIVE_PERFORMANCE;
        }
      }
      const isExclusive = element => {
        const torrentName = element.querySelector(".torrentname");
        const exclusiveLink = torrentName.querySelector('a[href="torrents.php?tag_exclusive=yes"]');
        return null != exclusiveLink;
      };
      class Pter extends _tracker__WEBPACK_IMPORTED_MODULE_1__.xw {
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
          const elements = Array.from(document.querySelectorAll("#torrenttable > tbody > tr")).slice(1);
          yield {
            total: elements.length
          };
          for (let element of elements) {
            if (isExclusive(element)) {
              element.style.display = "none";
              continue;
            }
            const spanElement = element.querySelector("span[data-imdbid]");
            let imdbId = spanElement ? spanElement.getAttribute("data-imdbid").trim() : null;
            if (imdbId) imdbId = "tt" + imdbId; else imdbId = null;
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.GC)(element.querySelector(".torrentname a").textContent.trim());
            const request = {
              torrents: [ parseTorrent(element) ],
              dom: [ element ],
              imdbId,
              title,
              year,
              category: parseCategory(element)
            };
            yield request;
          }
        }
        name() {
          return "Pter";
        }
        async search(request) {
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_1__.lt.NOT_CHECKED;
          const queryUrl = `https://pterclub.com/torrents.php?search=${request.imdbId}`;
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.uU)(queryUrl);
          return null === result.querySelector("#torrenttable") ? _tracker__WEBPACK_IMPORTED_MODULE_1__.lt.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_1__.lt.EXIST;
        }
        insertTrackersSelect(select) {
          const targetLine = document.querySelector(".searchbox > tbody:last-child table tr");
          if (!targetLine) return;
          const td = document.createElement("td");
          td.classList.add("embedded");
          td.appendChild(select);
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.U_)(targetLine, td);
        }
      }
    },
    641: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => RED
      });
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(257);
      var common_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(616);
      const parseTorrents = html => {
        const groups = Array.from(html.querySelectorAll(".group_info strong"));
        const torrents = [];
        for (let group of groups) {
          const yearAndTitle = group?.textContent?.split(" - ");
          if (yearAndTitle) torrents.push({
            year: parseInt(yearAndTitle[0], 10),
            title: yearAndTitle[1]
          });
        }
        return torrents;
      };
      function titlesAreEqual(first, second) {
        first = first.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        second = second.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return first.toLowerCase() == second.toLowerCase();
      }
      class RED extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
        canBeUsedAsSource() {
          return false;
        }
        canBeUsedAsTarget() {
          return true;
        }
        canRun(url) {
          return url.includes("redacted.sh");
        }
        async* getSearchRequest() {
          yield {
            total: 0
          };
        }
        name() {
          return "RED";
        }
        async search(request) {
          if (request.category != _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MUSIC) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_ALLOWED;
          const musicRequest = request;
          if (musicRequest.type != _tracker__WEBPACK_IMPORTED_MODULE_0__.kk.ALBUM && musicRequest.type != _tracker__WEBPACK_IMPORTED_MODULE_0__.kk.SINGLE) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_ALLOWED;
          if (!musicRequest.artists || !musicRequest.titles || !musicRequest.year) {
            common_logger__WEBPACK_IMPORTED_MODULE_1__.k.debug("[{0}] Not enough data to check request: {1}", this.name(), request);
            return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
          }
          for (let artist of musicRequest.artists) for (let title of musicRequest.titles) {
            if ("VA" === artist) artist = "";
            if (artist) {
              const queryUrl = `https://redacted.sh/artist.php?artistname=${encodeURIComponent(artist)}`;
              const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.uU)(queryUrl);
              if (result.textContent?.includes("Your search did not match anything.") || result.querySelector("#search_terms")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_EXIST;
              const torrents = parseTorrents(result);
              common_logger__WEBPACK_IMPORTED_MODULE_1__.k.debug("[{0}] Parsed following torrents for artist: {1}: {2}", this.name(), artist, torrents);
              for (let torrent of torrents) if (torrent.year == request.year && titlesAreEqual(title, torrent.title)) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.EXIST;
            }
          }
          return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_EXIST;
        }
        insertTrackersSelect(select) {}
      }
    },
    237: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => SC
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(933);
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(257);
      function parseTorrent(element) {
        let infos = element.querySelector(".torrent_info .activity_info").querySelectorAll("div");
        let size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__._8)(infos[1].textContent);
        let resolution = infos[0]?.textContent?.trim();
        if ("CD" == resolution || "WEB" == resolution) resolution = void 0;
        let format;
        if ("DVD-R" === resolution) {
          resolution = _tracker__WEBPACK_IMPORTED_MODULE_1__.GV.SD;
          format = "VOB IFO";
        }
        return {
          size,
          tags: [],
          dom: element,
          resolution: resolution ? (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uV)(resolution) : void 0,
          format
        };
      }
      function parseCategory(element) {
        let category = _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.MOVIE;
        let infos = element.querySelector(".torrent_info .activity_info").querySelectorAll("div");
        let info = infos[0].textContent;
        if ("CD" == info || "WEB" === info) category = _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.MUSIC; else if (element.querySelector(".torrent_tags").textContent.includes("ebook")) category = _tracker__WEBPACK_IMPORTED_MODULE_1__.WD.BOOK;
        return category;
      }
      const parseYearTitle = element => {
        const title = element.querySelector(".torrent_title b").textContent;
        const year = parseInt(element.querySelector(".torrent_year").textContent.split("|")[0].trim(), 10);
        return {
          title,
          year
        };
      };
      class SC extends _tracker__WEBPACK_IMPORTED_MODULE_1__.xw {
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
          const elements = Array.from(document.querySelectorAll(".torrent_card")).filter((element => null != element.querySelector(".torrent_tags")));
          yield {
            total: elements.length
          };
          for (let element of elements) {
            let links_container = element.querySelector(".torrent_tags");
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.VB)(links_container);
            const {title, year} = parseYearTitle(element);
            const request = {
              torrents: [ parseTorrent(element) ],
              dom: [ element ],
              imdbId,
              title,
              year,
              category: parseCategory(element)
            };
            yield request;
          }
        }
        name() {
          return "SC";
        }
        async search(request) {
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_1__.lt.NOT_CHECKED;
          const queryUrl = `https://secret-cinema.pw/torrents.php?action=advanced&searchsubmit=1&cataloguenumber=${request.imdbId}&order_by=time&order_way=desc&tags_type=0`;
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.uU)(queryUrl);
          return null === result.querySelector(".torrent_card_container") ? _tracker__WEBPACK_IMPORTED_MODULE_1__.lt.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_1__.lt.EXIST;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.U_)(document.querySelector("#ft_container p"), select);
        }
      }
    },
    790: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => TL
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(933);
      var common_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(616);
      const parseCategory = element => {
        let categoryLink = element.querySelector(".info a.category");
        const category = categoryLink.getAttribute("data-ccid");
        if ("animation" == category) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.ANIME;
        if ("tv" == category) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.TV;
        if ("music" == category) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MUSIC;
        if ("games" == category) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.GAME;
        if ("movies" == category) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE;
        if ("books" == category) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.BOOK;
        if (categoryLink.textContent.trim().includes("TV")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.TV;
      };
      class TL extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
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
          common_logger__WEBPACK_IMPORTED_MODULE_1__.k.debug("[{0}] Parsing titles to check", this.name());
          const elements = Array.from(document.querySelectorAll(".torrent"));
          yield {
            total: elements.length
          };
          for (let element of elements) {
            const torrentTitle = element.querySelector(".name a").childNodes[0].textContent;
            common_logger__WEBPACK_IMPORTED_MODULE_1__.k.debug("[TL] Checking torrent: {0}", torrentTitle);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.VB)(element);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__._8)(element.querySelector(".td-size")?.textContent);
            const category = parseCategory(element);
            let title;
            let year;
            if (category == _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE) ({title, year} = (0, 
            _utils_utils__WEBPACK_IMPORTED_MODULE_2__.GC)(element.querySelector(".name a").childNodes[0].textContent));
            const request = {
              torrents: [ {
                size,
                tags: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.RN)(torrentTitle),
                dom: element,
                resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.uV)(torrentTitle),
                container: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Ji)(torrentTitle),
                releaseGroup: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_2__.ds)(torrentTitle)
              } ],
              dom: [ element ],
              imdbId,
              title,
              year,
              category
            };
            yield request;
          }
        }
        name() {
          return "TL";
        }
        async search(request) {
          return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          select.style.margin = "20px 0";
          select.style.padding = "2px 2px 3px 2px";
          select.style.color = "#111";
          (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.U_)(document.querySelector(".sub-navbar"), select);
        }
      }
    },
    510: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => TNT
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(933);
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(257);
      var common_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(616);
      const parseCategory = category => {
        if ([ 24, 18, 17, 20, 19, 34, 36, 45, 22, 37, 35, 43, 38, 39, 46 ].includes(category)) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE;
        if ([ 27, 28, 16, 2, 29, 40, 41, 42 ].includes(category)) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.TV;
        if ([ 10, 12, 13, 14 ].includes(category)) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.GAME;
        if ([ 1 ].includes(category)) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.AUDIOBOOK;
        if ([ 8 ].includes(category)) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.BOOK;
        if ([ 2, 41 ].includes(category)) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.ANIME;
        if ([ 44, 25, 26 ].includes(category)) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MUSIC;
      };
      const getTorrentTitle = element => {
        const h5 = element.children[1].querySelector("h5");
        const newTag = h5.querySelector(".newTag");
        if (newTag) h5.removeChild(newTag);
        return h5.textContent;
      };
      class TNT extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return false;
        }
        canRun(url) {
          return url.includes("tntracker.org") && url.includes("/?perPage=");
        }
        async* getSearchRequest() {
          common_logger__WEBPACK_IMPORTED_MODULE_1__.k.debug("[{0}] Parsing titles to check", this.name());
          const elements = Array.from(document.querySelectorAll("#table_gen_wrapper .sTable tbody tr"));
          yield {
            total: elements.length
          };
          for (let element of elements) {
            const torrentTitle = getTorrentTitle(element);
            common_logger__WEBPACK_IMPORTED_MODULE_1__.k.debug("[TNT] Checking torrent: {0}", torrentTitle);
            const torrentId = element.children[1].querySelector("a").href.split("/").pop();
            const token = JSON.parse(localStorage.getItem("ngStorage-token"));
            const data = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.sb)(`https://tntracker.org/api/torrent?id=${torrentId}`, {
              headers: {
                Authorization: token
              }
            });
            const imdbId = "tt" + data.imdb;
            const size = data.size / 1024 / 1024;
            const category = parseCategory(data.category);
            let title;
            let year;
            let request = {
              dom: [ element ],
              category
            };
            if (category == _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE) {
              ({title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_3__.GC)(torrentTitle));
              request = {
                ...request,
                torrents: [ {
                  size,
                  tags: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_3__.RN)(torrentTitle),
                  dom: element,
                  resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_3__.uV)(torrentTitle),
                  container: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_3__.Ji)(torrentTitle)
                } ],
                year,
                title: title?.replace(".", " "),
                imdbId
              };
            } else if (category == _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MUSIC) {
              const splittedTitle = torrentTitle.split("-");
              const artists = [ splittedTitle[0].replaceAll("_", " ") ];
              const titles = [ splittedTitle[1].replaceAll("_", " ") ];
              const year = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_3__.SH)(torrentTitle);
              const {container, format} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_3__.mp)(torrentTitle);
              request = {
                ...request,
                torrents: [ {
                  dom: element,
                  size,
                  format,
                  container
                } ],
                artists,
                titles,
                year,
                type: _tracker__WEBPACK_IMPORTED_MODULE_0__.kk.ALBUM
              };
            }
            yield request;
          }
        }
        name() {
          return "TNT";
        }
        async search(request) {
          return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
        }
        async insertTrackersSelect(select) {
          await (0, common_http__WEBPACK_IMPORTED_MODULE_2__._v)(3e3);
          if (document.getElementById("find-unique-titles")) return;
          const form = document.getElementById("search").parentElement;
          const wrapper = document.createElement("div");
          wrapper.classList.add("selector");
          wrapper.id = "find-unique-titles";
          (0, common_dom__WEBPACK_IMPORTED_MODULE_4__.U_)(wrapper, select);
          (0, common_dom__WEBPACK_IMPORTED_MODULE_4__.U_)(form, wrapper);
        }
      }
    },
    707: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => TSeeds
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(933);
      var common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(257);
      var common_searcher__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(914);
      var common_trackers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(263);
      const parseCategory = element => {
        const icon = element.querySelector("i.torrent-icon");
        if (!icon) return;
        if (icon.classList.contains("fa-female")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.XXX;
        if (icon.classList.contains("fa-tv")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.TV;
        if (icon.classList.contains("fa-film")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE;
        if (icon.classList.contains("fa-music")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MUSIC;
        if (icon.classList.contains("fa-basketball-ball")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.SPORT;
        if (icon.classList.contains("fa-gamepad")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.GAME;
        return;
      };
      const parseYearAndTitle = element => {
        const spans = element.querySelectorAll("h1.movie-heading span");
        if (1 == spans.length) {
          const releaseName = element.querySelector('ol li.active span[itemprop="title"]').textContent.trim();
          return (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.E8)(releaseName);
        }
        const title = spans[0].textContent?.trim();
        let yearText = spans[1].textContent.trim();
        const year = parseInt(yearText.substring(1, yearText.length - 1), 10);
        return {
          title,
          year
        };
      };
      class TSeeds extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
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
          let nodes = Array.from(document.querySelectorAll(torrentsSelector));
          yield {
            total: nodes.length
          };
          for (const element of nodes) {
            const category = parseCategory(element);
            let imdbId = null;
            let title;
            let year;
            if (category == _tracker__WEBPACK_IMPORTED_MODULE_0__.WD.MOVIE) {
              const link = element.querySelector('a.view-torrent[href*="/torrents/"]');
              let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_2__.uU)(link.href);
              imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.VB)(response);
              ({title, year} = parseYearAndTitle(response));
            }
            let sizeText = element.querySelector(".torrent-listings-size span")?.textContent;
            if (isCategoryPage()) sizeText = element.children[7]?.textContent?.trim();
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__._8)(sizeText);
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element,
                resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.uV)(element.querySelector("a.view-torrent").textContent)
              } ],
              dom: [ element ],
              imdbId,
              title,
              year,
              category
            };
            yield request;
          }
        }
        name() {
          return "TSeeds";
        }
        async search(request) {
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
          const result = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_3__.yC)(common_trackers__WEBPACK_IMPORTED_MODULE_4__.FGl, {
            movie_title: "",
            movie_imdb_id: request.imdbId
          });
          if (result == common_searcher__WEBPACK_IMPORTED_MODULE_3__.lt.LOGGED_OUT) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_LOGGED_IN;
          return result == common_searcher__WEBPACK_IMPORTED_MODULE_3__.lt.NOT_FOUND ? _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.EXIST;
        }
        insertTrackersSelect(select) {
          if (isCategoryPage()) (0, common_dom__WEBPACK_IMPORTED_MODULE_5__.U_)(document.querySelector(".table-responsive.cat-torrents .text-center"), select); else {
            const wrapper = document.createElement("div");
            wrapper.classList.add("form-group", "col-xs-3");
            wrapper.appendChild(select);
            (0, common_dom__WEBPACK_IMPORTED_MODULE_5__.U_)(document.querySelector("#torrent-list-search div.row"), wrapper);
          }
        }
      }
      const isCategoryPage = () => document.location.toString().includes("/categories/");
    },
    855: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => TiK
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_searcher__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(914);
      var common_trackers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(263);
      var common_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(933);
      class TiK extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return true;
        }
        canRun(url) {
          return url.includes("cinematik.net");
        }
        async* getSearchRequest() {
          let elements = Array.from(document.querySelectorAll(".torrent-search--list__results tbody tr"));
          yield {
            total: elements.length
          };
          for (let element of elements) {
            let imdbId = "tt" + element.getAttribute("data-imdb-id");
            let size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__._8)(element.querySelector(".torrent-search--list__size").textContent);
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
        async search(request) {
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
          const result = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_2__.yC)(common_trackers__WEBPACK_IMPORTED_MODULE_3__.Uxl, {
            movie_title: "",
            movie_imdb_id: request.imdbId
          });
          if (result == common_searcher__WEBPACK_IMPORTED_MODULE_2__.lt.LOGGED_OUT) return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_LOGGED_IN;
          return result == common_searcher__WEBPACK_IMPORTED_MODULE_2__.lt.NOT_FOUND ? _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.EXIST;
        }
        insertTrackersSelect(select) {
          select.classList.add("form__select");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_4__.U_)(document.querySelectorAll(".panel__actions")[1], select);
        }
      }
    },
    54: (module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.a(module, (async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
        try {
          __webpack_require__.r(__webpack_exports__);
          __webpack_require__.d(__webpack_exports__, {
            Aither: () => _Aither__WEBPACK_IMPORTED_MODULE_0__.Z,
            AvistaZ: () => _AvistaZ__WEBPACK_IMPORTED_MODULE_1__.Z,
            BHD: () => _BHD__WEBPACK_IMPORTED_MODULE_2__.Z,
            BLU: () => _BLU__WEBPACK_IMPORTED_MODULE_3__.Z,
            BTarg: () => _BTarg__WEBPACK_IMPORTED_MODULE_4__.Z,
            CG: () => _CG__WEBPACK_IMPORTED_MODULE_5__.Z,
            CHD: () => _CHD__WEBPACK_IMPORTED_MODULE_6__.Z,
            CLANSUD: () => _CLAN_SUD__WEBPACK_IMPORTED_MODULE_7__.Z,
            CinemaZ: () => _CinemaZ__WEBPACK_IMPORTED_MODULE_8__.Z,
            DiscFan: () => _DiscFan__WEBPACK_IMPORTED_MODULE_9__.Z,
            FL: () => _FL__WEBPACK_IMPORTED_MODULE_10__.Z,
            GPW: () => _GPW__WEBPACK_IMPORTED_MODULE_11__.Z,
            HDB: () => _HDB__WEBPACK_IMPORTED_MODULE_12__.Z,
            HDSky: () => _HDSky__WEBPACK_IMPORTED_MODULE_13__.Z,
            HDT: () => _HDT__WEBPACK_IMPORTED_MODULE_14__.Z,
            IPT: () => _IPT__WEBPACK_IMPORTED_MODULE_15__.Z,
            JPTV: () => _JPTV__WEBPACK_IMPORTED_MODULE_16__.Z,
            JPop: () => _JPop__WEBPACK_IMPORTED_MODULE_17__.Z,
            KG: () => _KG__WEBPACK_IMPORTED_MODULE_18__.Z,
            LatTeam: () => _LatTeam__WEBPACK_IMPORTED_MODULE_19__.Z,
            MTV: () => _MTV__WEBPACK_IMPORTED_MODULE_20__.Z,
            MTeam: () => _MTeam__WEBPACK_IMPORTED_MODULE_21__.Z,
            NewInsane: () => _NewInsane__WEBPACK_IMPORTED_MODULE_23__.Z,
            PTP: () => _PTP__WEBPACK_IMPORTED_MODULE_25__.Z,
            Pter: () => _Pter__WEBPACK_IMPORTED_MODULE_24__.Z,
            RED: () => _RED__WEBPACK_IMPORTED_MODULE_26__.Z,
            SC: () => _SC__WEBPACK_IMPORTED_MODULE_27__.Z,
            TL: () => _TL__WEBPACK_IMPORTED_MODULE_29__.Z,
            TNT: () => _TNT__WEBPACK_IMPORTED_MODULE_30__.Z,
            TSeeds: () => _TSeeds__WEBPACK_IMPORTED_MODULE_31__.Z,
            TiK: () => _TiK__WEBPACK_IMPORTED_MODULE_28__.Z,
            nCore: () => _nCore__WEBPACK_IMPORTED_MODULE_22__.Z
          });
          var _Aither__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(387);
          var _AvistaZ__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(168);
          var _BHD__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(472);
          var _BLU__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(821);
          var _BTarg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(358);
          var _CG__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(284);
          var _CHD__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(435);
          var _CLAN_SUD__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(962);
          var _CinemaZ__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(846);
          var _DiscFan__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(134);
          var _FL__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(245);
          var _GPW__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(219);
          var _HDB__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(468);
          var _HDSky__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(124);
          var _HDT__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(597);
          var _IPT__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(991);
          var _JPTV__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(407);
          var _JPop__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(196);
          var _KG__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(522);
          var _LatTeam__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(143);
          var _MTV__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(422);
          var _MTeam__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(286);
          var _NewInsane__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(614);
          var _PTP__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(961);
          var _Pter__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(283);
          var _RED__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(641);
          var _SC__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(237);
          var _TL__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(790);
          var _TNT__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(510);
          var _TSeeds__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(707);
          var _TiK__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(855);
          var _nCore__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(754);
          var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([ _PTP__WEBPACK_IMPORTED_MODULE_25__ ]);
          _PTP__WEBPACK_IMPORTED_MODULE_25__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
          __webpack_async_result__();
        } catch (e) {
          __webpack_async_result__(e);
        }
      }));
    },
    754: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        Z: () => MTeam
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(657);
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(933);
      class MTeam extends _tracker__WEBPACK_IMPORTED_MODULE_0__.xw {
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
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.VB)(element);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__._8)(element.children[1].children[4].textContent);
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element
              } ],
              dom: [ element ],
              imdbId,
              title: ""
            };
            requests.push(request);
          }
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_0__.fM)(requests);
        }
        name() {
          return "nCore";
        }
        async search(request) {
          return _tracker__WEBPACK_IMPORTED_MODULE_0__.lt.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          const element = document.querySelector("#keresoresz tr");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.U_)(element, select);
        }
      }
    },
    84: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        GV: () => Resolution,
        WD: () => Category,
        fM: () => toGenerator,
        kk: () => MusicReleaseType,
        lt: () => SearchResult,
        xw: () => AbstractTracker
      });
      let Resolution = function(Resolution) {
        Resolution.SD = "SD";
        Resolution.HD = "HD";
        Resolution.FHD = "FHD";
        Resolution.UHD = "UHD";
        return Resolution;
      }({});
      let Category = function(Category) {
        Category.TV = "TV";
        Category.MOVIE = "MOVIE";
        Category.MUSIC = "MUSIC";
        Category.BOOK = "BOOK";
        Category.AUDIOBOOK = "AUDIOBOOK";
        Category.SPORT = "SPORT";
        Category.ANIME = "ANIME";
        Category.MV = "MV";
        Category.LIVE_PERFORMANCE = "PERFORMANCE";
        Category.STAND_UP = "UP";
        Category.DOCUMENTARY = "DOCUMENTARY";
        Category.GAME = "GAME";
        Category.XXX = "XXX";
        Category.OTHER = "OTHER";
        return Category;
      }({});
      let MusicReleaseType = function(MusicReleaseType) {
        MusicReleaseType.ALBUM = "ALBUM";
        MusicReleaseType.SINGLE = "SINGLE";
        MusicReleaseType.TV_MUSIC = "TV_MUSIC";
        return MusicReleaseType;
      }({});
      let SearchResult = function(SearchResult) {
        SearchResult.EXIST = "EXIST";
        SearchResult.EXIST_BUT_MISSING_SLOT = "EXIST_BUT_MISSING_SLOT";
        SearchResult.NOT_EXIST = "NOT_EXIST";
        SearchResult.MAYBE_NOT_EXIST = "MAYBE_NOT_EXIST";
        SearchResult.NOT_EXIST_WITH_REQUEST = "NOT_EXIST_WITH_REQUEST";
        SearchResult.MAYBE_NOT_EXIST_WITH_REQUEST = "MAYBE_NOT_EXIST_WITH_REQUEST";
        SearchResult.NOT_CHECKED = "NOT_CHECKED";
        SearchResult.NOT_LOGGED_IN = "NOT_LOGGED_IN";
        SearchResult.NOT_ALLOWED = "NOT_ALLOWED";
        return SearchResult;
      }({});
      class AbstractTracker {
        waitTimeInMillisBetweenRequest() {
          return 1e3;
        }
      }
      const toGenerator = async function*(requests) {
        yield {
          total: requests.length
        };
        for (const request of requests) yield request;
      };
    },
    698: (module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.a(module, (async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
        try {
          __webpack_require__.d(__webpack_exports__, {
            _h: () => addToMemoryCache,
            ff: () => existsInCache,
            hW: () => getFromMemoryCache,
            sA: () => clearMemoryCache,
            se: () => addToCache
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
    996: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        I5: () => updateTotalCount,
        WC: () => createTrackersSelect,
        X_: () => addCounter,
        t: () => updateNewContent,
        tx: () => updateCount
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
    657: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        E8: () => parseYearAndTitleFromReleaseName,
        GC: () => parseYearAndTitle,
        Ji: () => parseCodec,
        RN: () => parseTags,
        SH: () => parseYear,
        VB: () => parseImdbIdFromLink,
        _8: () => parseSize,
        ds: () => parseReleaseGroup,
        lL: () => parseTmdbIdFromLink,
        mp: () => parseContainerAndFormat,
        rT: () => parseImdbId,
        uV: () => parseResolution
      });
      var _trackers_tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
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
      const parseTmdbIdFromLink = element => {
        const tmdbLink = element.querySelector('[href*="https://www.themoviedb.org"]');
        if (tmdbLink) {
          let parts = tmdbLink.href.split("/");
          return parts[parts.length - 1].trim().replaceAll(/\?.+/g, "");
        }
        return null;
      };
      const parseImdbId = text => {
        if (!text) return null;
        const results = text.match(/(tt\d+)/);
        if (!results) return null;
        return results[0];
      };
      const parseResolution = text => {
        if (!text) return;
        const resolutionsAndAliases = {
          SD: [ "sd", "pal", "ntsc" ],
          HD: [ "720p", "hd" ],
          FHD: [ "1080p", "fhd", "full_hd" ],
          UHD: [ "2160p", "uhd", "4k" ]
        };
        for (let resolution in resolutionsAndAliases) {
          let aliases = resolutionsAndAliases[resolution];
          for (let alias of aliases) if (text.includes(alias)) return resolution;
        }
        const regex = /\b(\d{3,4})x(\d{3,4})\b/;
        const match = text.match(regex);
        if (match) {
          const height = parseInt(match[2]);
          if (height < 720) return _trackers_tracker__WEBPACK_IMPORTED_MODULE_0__.GV.SD;
          if (height < 1080) return _trackers_tracker__WEBPACK_IMPORTED_MODULE_0__.GV.HD;
          if (height < 2160) return _trackers_tracker__WEBPACK_IMPORTED_MODULE_0__.GV.FHD;
          return _trackers_tracker__WEBPACK_IMPORTED_MODULE_0__.GV.UHD;
        }
        return;
      };
      const parseYearAndTitleFromReleaseName = releaseName => {
        const regex = /^(.+?)\.(\d{4})\./;
        const match = releaseName.match(regex);
        if (match) {
          const title = match[1].replace(/\./g, " ").trim();
          const year = parseInt(match[2], 10);
          return {
            year,
            title
          };
        }
        return {
          year: void 0,
          title: void 0
        };
      };
      const parseCodec = title => {
        title = title.toLowerCase();
        const codecAndAlias = {
          x264: [ "x264", "h264", "h.264", "h 264" ],
          x265: [ "x265", "h265", "h.265", "h 265", "hevc" ]
        };
        for (let codec in codecAndAlias) {
          let aliases = codecAndAlias[codec];
          for (let alias of aliases) if (title.includes(alias)) return codec;
        }
        return null;
      };
      const parseTags = title => {
        const tags = [];
        if (!title) return tags;
        if (title.toLowerCase().includes("remux")) tags.push("Remux");
        if (title.replaceAll(new RegExp("HDRip", "gi"), "").includes("HDR")) tags.push("HDR");
        if (title.includes("DV")) tags.push("DV");
        return tags;
      };
      const parseYearAndTitle = title => {
        if (!title) return {
          title: void 0,
          year: void 0
        };
        const regexes = [ /^(.*?)\s+\(?(\d{4})\)?\s+(.*)/, /(.+?)\.(\d\d\d\d)/, /(.+?) \((\d\d\d\d)\)/ ];
        for (let regex of regexes) {
          const match = title.match(regex);
          if (match) {
            const title = match[1].trim();
            const year = parseInt(match[2], 10);
            return {
              title,
              year
            };
          }
        }
        return {
          title: void 0,
          year: void 0
        };
      };
      const parseContainerAndFormat = text => {
        const containers = [ "FLAC", "MP3" ];
        const formats = [ "Lossless", "320", "V0" ];
        let result = {};
        for (let container of containers) if (text.includes(container)) result = {
          container
        };
        for (let format of formats) if (text.includes(format)) result = {
          ...result,
          format
        };
        return result;
      };
      const parseYear = title => {
        const regex = /-(\d{4})-/;
        const match = title.match(regex);
        if (match) return parseInt(match[1], 10);
      };
      const parseReleaseGroup = title => {
        const lastDashIndex = title.lastIndexOf("-");
        if (-1 === lastDashIndex || lastDashIndex === title.length - 1) return null;
        const maybeGroup = title.substring(lastDashIndex + 1).trim();
        if (maybeGroup.includes(" ")) return null;
        return maybeGroup;
      };
    },
    933: (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        $f: () => appendErrorMessage,
        BE: () => insertAfter,
        Ew: () => findFirst,
        U_: () => addChild,
        Vt: () => insertBefore,
        x2: () => showError
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
          if (elements.length > 0) return Array.from(elements);
        }
        return [];
      };
    },
    257: (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        uU: () => fetchAndParseHtml,
        sb: () => fetchAndParseJson,
        lC: () => fetchUrl,
        _v: () => sleep
      });
      var logger = __webpack_require__(616);
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
      const parser = new DOMParser;
      const fetchUrl = async (input, options = {}, wait = 1e3) => {
        await sleep(wait);
        logger.k.debug("Will fetch {0}", input);
        const res = await GM_fetch(input, options);
        return await res.text();
      };
      const fetchAndParseHtml = async query_url => {
        const response = await fetchUrl(query_url);
        return parser.parseFromString(response, "text/html").body;
      };
      const fetchAndParseJson = async (query_url, options = {}) => {
        const response = await fetchUrl(query_url, options);
        return JSON.parse(response);
      };
      const sleep = ms => new Promise((resolve => setTimeout(resolve, ms)));
    },
    616: (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        k: () => logger,
        z: () => LEVEL
      });
      var LEVEL;
      !function(LEVEL) {
        LEVEL[LEVEL.DEBUG = 0] = "DEBUG";
        LEVEL[LEVEL.INFO = 1] = "INFO";
      }(LEVEL || (LEVEL = {}));
      const logger = {
        level: LEVEL.INFO,
        prefix: "",
        setLevel: level => {
          logger.level = level;
        },
        setPrefix: prefix => {
          logger.prefix = prefix;
        },
        info: (message, ...args) => {
          if (logger.level <= LEVEL.INFO) console.log(formatMessage(LEVEL.INFO, message, args));
        },
        debug: (message, ...args) => {
          if (logger.level <= LEVEL.DEBUG) console.log(formatMessage(LEVEL.DEBUG, message, args));
        }
      };
      const formatMessage = (level, message, args) => {
        let levelPrefix = "";
        if (level == LEVEL.INFO) levelPrefix = "[INFO]"; else if (level == LEVEL.DEBUG) levelPrefix = "[DEBUG]";
        return `${logger.prefix} ${levelPrefix} "` + message.replace(/{(\d+)}/g, ((match, index) => {
          const argIndex = parseInt(index, 10);
          const argValue = args[argIndex];
          return "object" == typeof argValue ? stringifyWithoutDOM(argValue) : argValue;
        })).trim();
      };
      const stringifyWithoutDOM = obj => {
        const seen = new WeakSet;
        function replacer(_key, value) {
          if (value instanceof Node) return;
          if ("object" == typeof value && null !== value) {
            if (seen.has(value)) return "[Circular Reference]";
            seen.add(value);
          }
          return value;
        }
        return JSON.stringify(obj, replacer);
      };
    },
    914: (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        It: () => getImdbIdFromTmdbID,
        lt: () => SearchResult,
        yC: () => search
      });
      var _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(257);
      var SearchResult;
      !function(SearchResult) {
        SearchResult[SearchResult.FOUND = 0] = "FOUND";
        SearchResult[SearchResult.NOT_FOUND = 1] = "NOT_FOUND";
        SearchResult[SearchResult.LOGGED_OUT = 2] = "LOGGED_OUT";
        SearchResult[SearchResult.ERROR = 3] = "ERROR";
      }(SearchResult || (SearchResult = {}));
      const search = async (tracker, options) => {
        const rate = "rateLimit" in tracker ? tracker.rateLimit : 200;
        const domain = tracker.searchUrl.split("/")[2];
        const now = (new Date).getTime();
        let lastLoaded = window.localStorage[domain + "_lastLoaded"];
        if (!lastLoaded) lastLoaded = now - 5e4; else lastLoaded = parseInt(lastLoaded);
        if (now - lastLoaded < rate) await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__._v)(now - lastLoaded); else window.localStorage[domain + "_lastLoaded"] = (new Date).getTime();
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
          response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.lC)(searchUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
              ...reqHeader
            },
            body: post_data
          });
        } else response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.lC)(searchUrl, {
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
        const response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.lC)(url);
        if (response.match("seriesid")) {
          const xmldata = (new DOMParser).parseFromString(response, "application/xml");
          return xmldata.getElementsByTagName("seriesid")[0].childNodes[0].nodeValue;
        }
        return "00000000";
      };
      const getTMDbID = async imdbID => {
        const url = "https://api.themoviedb.org/3/find/" + imdbID + "?api_key=d12b33d3f4fb8736dc06f22560c4f8d4&external_source=imdb_id";
        const response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.lC)(url);
        const result = JSON.parse(response);
        if (result.movie_results && result.movie_results.length > 0) return result.movie_results[0].id; else if (result.tv_results && result.tv_results.length > 0) return result.tv_results[0].id; else if (result.tv_episode_results && result.tv_episode_results.length > 0) return result.tv_episode_results[0].id;
        return "00000000";
      };
      const getDoubanID0 = async imdbID => {
        const url = "https://movie.douban.com/j/subject_suggest?q=" + imdbID;
        const response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.lC)(url);
        const result = JSON.parse(response);
        if (result && result.length) return result[0].id;
        return "00000000";
      };
      const getDoubanID1 = async imdbID => {
        const url = "https://www.douban.com/search?cat=1002&q=" + imdbID;
        const result = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.uU)(url);
        const element = result.querySelector("[onclick*=" + imdbID + "]");
        if (element) {
          const href = element.getAttribute("href");
          if (href && href.match(/subject%2F(\d+)/)) return href.match(/subject%2F(\d+)/)[1];
        }
        return "00000000";
      };
      const getDoubanID2 = async imdbID => {
        const url = 'https://query.wikidata.org/sparql?format=json&query=SELECT * WHERE {?s wdt:P345 "' + imdbID + '". OPTIONAL { ?s wdt:P4529 ?Douban_film_ID. }}';
        const response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.lC)(url);
        const result = JSON.parse(response);
        if (null != result.results.bindings[0]) if (null != result.results.bindings[0].Douban_film_ID) return result.results.bindings[0].Douban_film_ID.value;
        return "00000000";
      };
      const getDoubanID3 = async imdbID => {
        const url = 'https://www.google.com/search?q="' + imdbID + '" site:https://movie.douban.com/subject&safe=off';
        const result = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.lC)(url);
        if (result.match("movie.douban.com/subject/")) {
          const x = result.split("movie.douban.com/subject/")[1];
          return x.split("/")[0];
        } else return "00000000";
      };
      const getImdbIdFromTmdbID = async tmdbId => {
        const url = `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids?api_key=d12b33d3f4fb8736dc06f22560c4f8d4`;
        const response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.lC)(url);
        const result = JSON.parse(response);
        return result.imdb_id;
      };
    },
    263: (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        AT: () => AT,
        CZ: () => CZ,
        FGl: () => TSeeds,
        FvT: () => MTV,
        KG: () => KG,
        N24: () => HDb,
        Uxl: () => Tik,
        YE3: () => MTV_TV,
        _0y: () => CHD,
        iep: () => Aither
      });
      const AT = {
        name: "AT",
        searchUrl: "https://avistaz.to/movies?search=&imdb=%tt%",
        loggedOutRegex: /Forgot Your Password/,
        matchRegex: /class="overlay-container"|class="movie-poster/,
        positiveMatch: true
      };
      const Aither = {
        name: "Aither",
        searchUrl: "https://aither.cc/torrents?imdbId=%nott%",
        loggedOutRegex: /Cloudflare|Ray ID|Forgot Your Password/,
        matchRegex: /torrent-search--list__overview/,
        positiveMatch: true,
        both: true
      };
      const CHD = {
        name: "CHD",
        searchUrl: "https://chdbits.co/torrents.php?incldead=0&spstate=0&inclbookmarked=0&search_area=4&search_mode=0&search=%tt%",
        loggedOutRegex: /Cloudflare|Ray ID|SSL \(HTTPS\)/,
        matchRegex: /Nothing found|没有种子|沒有種子/
      };
      const CZ = {
        name: "CZ",
        searchUrl: "https://cinemaz.to/movies?search=&imdb=%tt%",
        configName: "ET",
        loggedOutRegex: /Forgot Your Password/,
        matchRegex: /class="overlay-container"|class="movie-poster/,
        positiveMatch: true
      };
      const HDb = {
        name: "HDb",
        searchUrl: "https://hdbits.org/browse.php?c1=1&c2=1&c3=1&c4=1&c5=1&c7=1&c8=1&imdb=%tt%",
        loggedOutRegex: /Make sure your passcode generating|nginx/,
        matchRegex: /Nothing here!/,
        both: true
      };
      const KG = {
        name: "KG",
        searchUrl: "https://karagarga.in/browse.php?sort=added&search=%nott%&search_type=imdb&d=DESC",
        loggedOutRegex: /Cloudflare|Ray ID|Not logged in!/,
        matchRegex: /No torrents found/,
        rateLimit: 125,
        both: true
      };
      const MTV = {
        name: "MTV",
        searchUrl: "https://www.morethantv.me/torrents.php?filter_cat[1]=1&filter_cat[2]=1&title=+%2B%search_string%+%2B%year%",
        loggedOutRegex: /Cloudflare|Ray ID|forgotten password/,
        spaceEncode: "+%2B",
        matchRegex: /action=download/,
        positiveMatch: true
      };
      const MTV_TV = {
        name: "MTV",
        searchUrl: "https://www.morethantv.me/torrents.php?filter_cat[3]=1&filter_cat[5]=1&filter_cat[4]=1&filter_cat[6]=1&title=+%2B%search_string%",
        loggedOutRegex: /Cloudflare|Ray ID|forgotten password/,
        spaceEncode: "+%2B",
        matchRegex: /action=download/,
        positiveMatch: true,
        TV: true
      };
      const TSeeds = {
        name: "TSeeds",
        searchUrl: "https://www.torrentseeds.org/torrents?tmdbId=%tmdbid%",
        loggedOutRegex: /Cloudflare|Forgot Your Password|Service Unavailable/,
        matchRegex: /"Download">/,
        positiveMatch: true,
        both: true
      };
      const Tik = {
        name: "Tik",
        searchUrl: "https://cinematik.net/torrents?imdbId=%tt%",
        loggedOutRegex: /Cloudflare|Ray ID|Forgot Your Password/,
        matchRegex: /torrent-search--list__overview/,
        positiveMatch: true,
        both: true
      };
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
  __webpack_require__(940);
})();