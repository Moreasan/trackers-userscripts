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
// @match https://filelist.io/internal.php*
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
// @require https://cdn.jsdelivr.net/npm/jquery@^4.0.0/dist/jquery.min.js
// @require https://openuserjs.org/src/libs/sizzle/GM_config.js
// @updateURL https://github.com/Moreasan/trackers-userscripts/blob/master/Find%20Unique%20Titles/dist/find.unique.titles.user.js
// ==/UserScript==

(() => {
  "use strict";
  var __webpack_modules__ = {
    767(module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
        try {
          var _trackers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(345);
          var _trackers_tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
          var _utils_cache__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(867);
          var _utils_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(589);
          var _settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(678);
          var common_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(255);
          var common_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(553);
          var common_logger__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(511);
          var _trackers__WEBPACK_IMPORTED_MODULE_0___namespace_object = {};
          __webpack_require__.r(_trackers__WEBPACK_IMPORTED_MODULE_0___namespace_object);
          __webpack_require__.d(_trackers__WEBPACK_IMPORTED_MODULE_0___namespace_object, {
            Aither: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.mI,
            AvistaZ: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.X3,
            BHD: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.Ry,
            BLU: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.M0,
            BTarg: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.HJ,
            CG: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.CG,
            CHD: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.e5,
            CLANSUD: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.vc,
            CinemaZ: () => _trackers__WEBPACK_IMPORTED_MODULE_0__._A,
            DiscFan: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.fj,
            FL: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.FL,
            GPW: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.jw,
            HDB: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.vD,
            HDSky: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.MW,
            HDT: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.h1,
            IPT: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.WS,
            JPTV: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.h4,
            JPop: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.Cc,
            KG: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.KG,
            LatTeam: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.pX,
            MTeam: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.t4,
            NewInsane: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.Rh,
            PTP: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.vo,
            Pter: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.KN,
            RED: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.UH,
            SC: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.SC,
            TL: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.TL,
            TNT: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.N2,
            TSeeds: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.js,
            TiK: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.dV,
            nCore: () => _trackers__WEBPACK_IMPORTED_MODULE_0__.K$
          });
          var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([ _trackers__WEBPACK_IMPORTED_MODULE_0__, _utils_cache__WEBPACK_IMPORTED_MODULE_2__ ]);
          [_trackers__WEBPACK_IMPORTED_MODULE_0__, _utils_cache__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
          function hideTorrents(request) {
            for (let element of request.dom) element.style.display = "none";
            for (let torrent of request.torrents) torrent.dom.style.display = "none";
          }
          const setUpLogger = debugMode => {
            common_logger__WEBPACK_IMPORTED_MODULE_7__.v.setPrefix("[Find Unique Titles]");
            if (debugMode) common_logger__WEBPACK_IMPORTED_MODULE_7__.v.setLevel(common_logger__WEBPACK_IMPORTED_MODULE_7__.B.DEBUG);
          };
          const main = async function() {
            const settings = (0, _settings__WEBPACK_IMPORTED_MODULE_4__.m)();
            setUpLogger(settings.debug);
            common_logger__WEBPACK_IMPORTED_MODULE_7__.v.info("Init User script");
            if (document.getElementById("tracker-select")) return;
            const url = window.location.href;
            let sourceTracker = null;
            let targetTrackers = [];
            Object.keys(_trackers__WEBPACK_IMPORTED_MODULE_0___namespace_object).forEach(trackerName => {
              const trackerImplementation = new _trackers__WEBPACK_IMPORTED_MODULE_0___namespace_object[trackerName];
              if (trackerImplementation.canRun(url)) sourceTracker = trackerImplementation; else if (trackerImplementation.canBeUsedAsTarget()) targetTrackers.push(trackerImplementation);
            });
            if (null == sourceTracker) return;
            const select = (0, _utils_dom__WEBPACK_IMPORTED_MODULE_3__.wZ)(targetTrackers.map(tracker => tracker.name()));
            select.addEventListener("change", async () => {
              let answer = confirm("Start searching new content for:  " + select.value);
              if (answer) {
                const targetTracker = targetTrackers.find(tracker => tracker.name() === select.value);
                let i = 1;
                let newContent = 0;
                let requestGenerator = sourceTracker.getSearchRequest();
                const metadata = (await requestGenerator.next()).value;
                (0, _utils_dom__WEBPACK_IMPORTED_MODULE_3__.I5)();
                (0, _utils_dom__WEBPACK_IMPORTED_MODULE_3__.N8)(metadata.total);
                common_logger__WEBPACK_IMPORTED_MODULE_7__.v.debug("[{0}] Parsing titles to check", sourceTracker.name());
                for await (const item of requestGenerator) {
                  if (null == item) continue;
                  const request = item;
                  common_logger__WEBPACK_IMPORTED_MODULE_7__.v.debug("[{0}] Search request: {1}", sourceTracker.name(), request);
                  try {
                    if (settings.useCache && request.imdbId && (0, _utils_cache__WEBPACK_IMPORTED_MODULE_2__.SW)(targetTracker.name(), request.imdbId)) {
                      common_logger__WEBPACK_IMPORTED_MODULE_7__.v.debug("Title exists in target tracker, found using cache");
                      hideTorrents(request);
                      continue;
                    }
                    await (0, common_http__WEBPACK_IMPORTED_MODULE_6__.yy)(targetTracker.waitTimeInMillisBetweenRequest());
                    const response = await targetTracker.search(request);
                    common_logger__WEBPACK_IMPORTED_MODULE_7__.v.debug("Search response: {0}", response);
                    if (response == _trackers_tracker__WEBPACK_IMPORTED_MODULE_1__.q0.EXIST || response == _trackers_tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_ALLOWED) {
                      if (request.imdbId) await (0, _utils_cache__WEBPACK_IMPORTED_MODULE_2__.ls)(targetTracker.name(), request.imdbId);
                      hideTorrents(request);
                    } else if (response == _trackers_tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_LOGGED_IN) {
                      alert(`You are not logged in ${targetTracker.name()}`);
                      break;
                    } else {
                      newContent++;
                      (0, _utils_dom__WEBPACK_IMPORTED_MODULE_3__.bG)(newContent);
                      if (response == _trackers_tracker__WEBPACK_IMPORTED_MODULE_1__.q0.MAYBE_NOT_EXIST) {
                        request.dom[0].setAttribute("title", "Title may not exist on target tracker");
                        request.dom[0].style.border = "2px solid #9b59b6";
                      } else if (response == _trackers_tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_EXIST_WITH_REQUEST) {
                        request.dom[0].setAttribute("title", "Title was not found and has matching requests");
                        request.dom[0].style.border = "2px solid #2ecc71";
                      } else if (response == _trackers_tracker__WEBPACK_IMPORTED_MODULE_1__.q0.MAYBE_NOT_EXIST_WITH_REQUEST) {
                        request.dom[0].setAttribute("title", "Title may not exists and there are matching requests");
                        request.dom[0].style.border = "2px solid #e67e22";
                      } else if (response == _trackers_tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED) {
                        request.dom[0].setAttribute("title", "Title was not checked on target tracker");
                        request.dom[0].style.border = "2px solid #e74c3c";
                      } else if (response == _trackers_tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_EXIST) {
                        request.dom[0].setAttribute("title", "Title was not found on target tracker");
                        request.dom[0].style.border = "2px solid #3498db";
                      } else if (response == _trackers_tracker__WEBPACK_IMPORTED_MODULE_1__.q0.EXIST_BUT_MISSING_SLOT) {
                        request.dom[0].setAttribute("title", "Title exists but there is an available slot on target tracker");
                        request.dom[0].style.border = "2px solid #ff00ff";
                      }
                    }
                  } catch (e) {
                    console.trace("Error occurred: ", e);
                    common_logger__WEBPACK_IMPORTED_MODULE_7__.v.info("Error occurred when checking {0}, {1]", request, e);
                    request.dom[0].setAttribute("title", "Title was not checked due to an error");
                    request.dom[0].style.border = "2px solid red";
                  } finally {
                    (0, _utils_dom__WEBPACK_IMPORTED_MODULE_3__.L6)(i++);
                  }
                }
                (0, _utils_cache__WEBPACK_IMPORTED_MODULE_2__.Pn)();
              }
            });
            sourceTracker.insertTrackersSelect(select);
          };
          (0, common_dom__WEBPACK_IMPORTED_MODULE_5__.WY)();
          main().catch(e => {
            (0, common_dom__WEBPACK_IMPORTED_MODULE_5__.Qg)(e.message);
          });
          let currentUrl = document.location.href;
          const observer = new MutationObserver(async () => {
            if (document.location.href !== currentUrl) await main();
          });
          const config = {
            subtree: true,
            childList: true
          };
          observer.observe(document, config);
          window.addEventListener("beforeunload", function() {
            observer.disconnect();
          });
          __webpack_async_result__();
        } catch (e) {
          __webpack_async_result__(e);
        }
      });
    },
    678(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
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
      GM_registerMenuCommand("Settings", () => GM_config.open());
      const getSettings = () => ({
        onlyNewTitles: GM_config.get("onlyNewTitles"),
        useCache: GM_config.get("useCache"),
        debug: GM_config.get("debug"),
        sizeDifferenceThreshold: GM_config.get("sizeDifferenceThreshold")
      });
      __webpack_require__.d(__webpack_exports__, [ "m", 0, getSettings ]);
    },
    680(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => Aither
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(553);
      var common_searcher__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(346);
      var common_trackers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(175);
      const parseCategory = element => {
        const categoryLink = element.querySelector(".torrent__category-link");
        if (!categoryLink) return;
        const categoryName = categoryLink.textContent?.trim();
        if ("TV" == categoryName) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.TV;
        if ("Movie" == categoryName) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE;
        return;
      };
      class Aither extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
            let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_3__.Wx)(link);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(response);
            const category = parseCategory(response);
            let torrentName = linkElement.textContent.trim();
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uU)(torrentName);
            let size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element.querySelector(".torrent-search--list__size").textContent.trim());
            const request = {
              torrents: [ {
                size,
                tags: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.rL)(torrentName),
                dom: element,
                resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.sG)(torrentName)
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
          if (request.category !== _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE && request.category !== _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.TV) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
          const result = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_4__.$P)(common_trackers__WEBPACK_IMPORTED_MODULE_5__.mIQ, {
            movie_title: "",
            movie_imdb_id: request.imdbId
          });
          if (result == common_searcher__WEBPACK_IMPORTED_MODULE_4__.q0.LOGGED_OUT) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_LOGGED_IN;
          return result == common_searcher__WEBPACK_IMPORTED_MODULE_4__.q0.NOT_FOUND ? _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.EXIST;
        }
        insertTrackersSelect(select) {
          const parent = document.querySelector(".panelV2 .panel__header");
          if (!parent) return;
          const div = document.createElement("div");
          select.style.width = "170px";
          div.classList.add("form__group");
          select.classList.add("form__select");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(div, select);
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.WH)(div, parent.querySelector("h2"));
        }
      }
    },
    855(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => AvistaZ
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_searcher__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(346);
      var common_trackers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(175);
      class AvistaZ extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(element);
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uU)(element.querySelector("a")?.getAttribute("title"));
            const request = {
              torrents: [ {
                dom: element
              } ],
              dom: [ element ],
              imdbId,
              title,
              year,
              category: _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE
            };
            yield request;
          }
        }
        name() {
          return "AvistaZ";
        }
        async search(request) {
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
          const result = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_3__.$P)(common_trackers__WEBPACK_IMPORTED_MODULE_4__.AT, {
            movie_title: "",
            movie_imdb_id: request.imdbId
          });
          if (result == common_searcher__WEBPACK_IMPORTED_MODULE_3__.q0.LOGGED_OUT) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_LOGGED_IN;
          return result == common_searcher__WEBPACK_IMPORTED_MODULE_3__.q0.NOT_FOUND ? _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.EXIST;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(document.querySelector("#content-area > div.well.well-sm"), select);
        }
      }
    },
    711(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => BHD
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(553);
      const parseTorrents = element => {
        const torrents = [];
        element.querySelectorAll('tr[id^="resulttorrent"]').forEach(torrentElement => {
          const data = torrentElement.children[0].textContent.trim().split("/");
          const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(torrentElement.children[4].textContent.trim());
          const tags = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.rL)(torrentElement.textContent);
          const torrent = {
            container: data[0].trim(),
            format: data[1].trim(),
            resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.sG)(data[3].trim()),
            tags,
            size,
            dom: torrentElement
          };
          torrents.push(torrent);
        });
        return torrents;
      };
      const parseCategory = element => {
        const html = element.children[0].innerHTML;
        if (html.includes("categories/tv")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.TV; else if (html.includes("categories/movies")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE;
        return;
      };
      const parseTorrentsFromTorrentsPage = () => {
        const requests = [];
        Array.from(document.querySelectorAll('tr[id^="torrentposter"]')).forEach(element => {
          let imdbId = null;
          let libraryId = element.getAttribute("library");
          if (libraryId) {
            let imdbElement = document.querySelector(`#librarydiv${libraryId}`);
            if (imdbElement) imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(imdbElement);
          }
          const tags = [];
          const torrentName = element.children[1].querySelector('a[id^="torrent"]').textContent;
          if (torrentName.toUpperCase().includes("REMUX")) tags.push("Remux");
          const torrent = {
            dom: element,
            size: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element.children[5].textContent),
            tags,
            resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.sG)(torrentName)
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
        });
        return requests;
      };
      const parseTorrentsFromLibraryPage = () => {
        const requests = [];
        document.querySelectorAll(".bhd-meta-box").forEach(element => {
          let imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(element);
          const request = {
            torrents: parseTorrents(element),
            dom: [ element ],
            imdbId,
            title: ""
          };
          requests.push(request);
        });
        return requests;
      };
      const isLibraryPage = () => window.location.href.includes("/library");
      const isTorrentsPage = () => window.location.href.includes("/torrents");
      class BHD extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.HN)(requests);
        }
        name() {
          return "BHD";
        }
        async search(request) {
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
          const queryUrl = "https://beyond-hd.me/library/movies?activity=&q=" + request.imdbId;
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_3__.Wx)(queryUrl);
          return 0 === result.querySelectorAll(".bhd-meta-box").length ? _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.EXIST;
        }
        insertTrackersSelect(select) {
          select.classList.add("beta-form-main");
          select.style.width = "170px";
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.nc)(select, document.querySelector(".button-center"));
        }
      }
    },
    620(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => BLU
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(553);
      class BLU extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
            let size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element.querySelector(".torrent-search--list__size").textContent);
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
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
          const queryUrl = "https://blutopia.xyz/torrents?perPage=25&imdbId=" + request.imdbId + "&sortField=size";
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_3__.Wx)(queryUrl);
          return null !== result.querySelector(".torrent-listings-no-result") ? _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.EXIST;
        }
        insertTrackersSelect(select) {
          select.classList.add("form__select");
          const wrapper = document.createElement("div");
          wrapper.classList.add("panel_action");
          wrapper.appendChild(select);
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(document.querySelectorAll(".panel__actions")[0], wrapper);
        }
      }
    },
    755(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => BTarg
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(553);
      const parseCategory = element => {
        const category = element.children[0].querySelector("a").href;
        if (category.includes("cat=02")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE;
        if (category.includes("cat=03")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.TV;
        if (category.includes("cat=05")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.XXX;
        if (category.includes("cat=08")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.LIVE_PERFORMANCE;
        return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.OTHER;
      };
      class BTarg extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
          const items = Array.from(document.querySelectorAll('tr a[href*="details.php?id"]')).filter(link => !link.href.includes("#") && link.href.includes("/details.php"));
          yield {
            total: items.length
          };
          for (const item of items) {
            let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_3__.Wx)(item.href);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Xt)(response.textContent);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(item.parentElement?.nextElementSibling?.textContent);
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
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.WH)(select, document.querySelector('select[name="inclfree"]'));
        }
      }
    },
    127(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => CG
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(553);
      const parseCategory = element => {
        const text = element.textContent.toLowerCase();
        if (text.includes("ebook")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.BOOK;
        return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE;
      };
      function parseTorrents(element) {
        const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element.querySelector("td:nth-child(5)")?.textContent);
        let container;
        let format;
        let resolution = _tracker__WEBPACK_IMPORTED_MODULE_1__.jg.SD;
        const text = element.textContent.toLowerCase();
        if (text.includes("1080p")) resolution = _tracker__WEBPACK_IMPORTED_MODULE_1__.jg.FHD; else if (text.includes("720p")) resolution = _tracker__WEBPACK_IMPORTED_MODULE_1__.jg.HD; else if (text.includes("dvd-r")) format = "VOB IFO";
        return [ {
          size,
          tags: [],
          dom: element,
          resolution,
          container,
          format
        } ];
      }
      class CG extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
          document.querySelectorAll("table.torrenttable tbody tr")?.forEach(element => {
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(element);
            const category = parseCategory(element);
            const request = {
              torrents: parseTorrents(element),
              dom: [ element ],
              imdbId,
              title: "",
              category
            };
            requests.push(request);
          });
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.HN)(requests);
        }
        name() {
          return "CG";
        }
        async search(request) {
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
          const queryUrl = "https://cinemageddon.net/browse.php?search=" + request.imdbId + "&orderby=size&dir=DESC";
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_3__.Wx)(queryUrl);
          return result.textContent.includes("Nothing found!") ? _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.EXIST;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(document.querySelector(".embedded > p"), select);
        }
      }
    },
    384(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => CHD
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(553);
      var common_searcher__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(346);
      var common_trackers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(175);
      class CHD extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
            let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_3__.Wx)(link.href);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(response);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element.querySelector(".rowfollow:nth-child(5)").textContent);
            let torrentName = element.querySelector(".torrentname a")?.getAttribute("title");
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uU)(torrentName);
            const request = {
              torrents: [ {
                size,
                tags: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.rL)(torrentName),
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
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
          const result = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_4__.$P)(common_trackers__WEBPACK_IMPORTED_MODULE_5__.e5O, {
            movie_title: "",
            movie_imdb_id: request.imdbId
          });
          if (result == common_searcher__WEBPACK_IMPORTED_MODULE_4__.q0.LOGGED_OUT) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_LOGGED_IN;
          return result == common_searcher__WEBPACK_IMPORTED_MODULE_4__.q0.NOT_FOUND ? _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.EXIST;
        }
        insertTrackersSelect(select) {
          const element = document.querySelector(".searchbox").children[2].querySelector("td td.rowfollow tr");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(element, select);
        }
        waitTimeInMillisBetweenRequest() {
          return 5e3;
        }
      }
    },
    916(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => CLANSUD
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(553);
      class CLANSUD extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
          const topics = Array.from(document.querySelectorAll('div[data-tableid="topics"] table')).filter(topic => {
            if (null != topic.getAttribute("bgColor") && null != !topic.getAttribute("bgcolor")) return false;
            if (0 === topic.querySelectorAll("img").length) return false;
            if (3 != topic.querySelectorAll("img").length) return false;
            if ("peliscr.jpg" !== topic.querySelectorAll("img")[2].alt) {
              topic.style.display = "none";
              return false;
            }
            return true;
          });
          yield {
            total: topics.length
          };
          for (const topic of topics) {
            const link = topic.querySelector("a").href;
            let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_3__.Wx)(link);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(response);
            const fullTitle = topic.querySelectorAll("tr td")[1]?.textContent?.trim()?.split("\n")[0];
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uU)(fullTitle);
            const request = {
              torrents: [ {
                resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.sG)(fullTitle),
                tags: [],
                dom: topic
              } ],
              dom: [ topic ],
              imdbId,
              title,
              year,
              category: _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE
            };
            yield request;
          }
        }
        name() {
          return "CLAN-SUD";
        }
        async search(request) {
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          const parent = document.querySelector('div[data-tableid="topics"]');
          if (parent) (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.nc)(select, parent);
        }
      }
    },
    262(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => CinemaZ
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_searcher__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(346);
      var common_trackers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(175);
      class CinemaZ extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(element);
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uU)(element.querySelector("a")?.getAttribute("title"));
            const request = {
              torrents: [ {
                dom: element
              } ],
              dom: [ element ],
              imdbId,
              title,
              year,
              category: _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE
            };
            yield request;
          }
        }
        name() {
          return "CinemaZ";
        }
        async search(request) {
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
          const result = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_3__.$P)(common_trackers__WEBPACK_IMPORTED_MODULE_4__.CZ, {
            movie_title: "",
            movie_imdb_id: request.imdbId
          });
          if (result == common_searcher__WEBPACK_IMPORTED_MODULE_3__.q0.LOGGED_OUT) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_LOGGED_IN;
          return result == common_searcher__WEBPACK_IMPORTED_MODULE_3__.q0.NOT_FOUND ? _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.EXIST;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(document.querySelector("#content-area > div.well.well-sm"), select);
        }
      }
    },
    535(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => DiscFan
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(553);
      class DiscFan extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
          let elements = Array.from(document.querySelectorAll(".torrents")[0].children[0].children).filter(element => element.querySelector(".torrentname"));
          yield {
            total: elements.length
          };
          for (const element of elements) {
            const link = element.querySelector('a[href*="details.php?id"]');
            if (!link) continue;
            let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_3__.Wx)(link.href);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(response);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element.children[4]?.textContent);
            const fullTitle = element.querySelector(".torrentname a")?.textContent;
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uU)(fullTitle);
            const request = {
              torrents: [ {
                size,
                tags: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.rL)(fullTitle),
                resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.sG)(fullTitle),
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
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          const element = document.querySelector(".searchbox")?.children[2].querySelector("td td.rowfollow tr");
          if (element) (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(element, select);
        }
      }
    },
    399(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => FL
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(553);
      class FL extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
            let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_3__.Wx)(link.href);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(response);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element.querySelector(".torrenttable:nth-child(7)")?.textContent);
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
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
          const queryUrl = "https://filelist.io/browse.php?search=" + request.imdbId + "&cat=0&searchin=1&sort=3";
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_3__.Wx)(queryUrl);
          return 0 === result.querySelectorAll(".torrentrow").length ? _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.EXIST;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(document.querySelector("form p"), select);
        }
      }
    },
    133(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => GPW
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(553);
      class GPW extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
            let imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(element);
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
                  resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.sG)(torrentElement.querySelector("span.TorrentTitle-item.resolution")?.textContent?.trim()),
                  size: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(torrentElement.querySelector("td.TableTorrent-cellStatSize")?.textContent),
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
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
          const queryUrl = `https://greatposterwall.com/torrents.php?groupname=${request.imdbId}`;
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_3__.Wx)(queryUrl);
          return null !== result.querySelector(".torrent-listings-no-result") ? _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.EXIST;
        }
        insertTrackersSelect(select) {
          select.classList.add("Input");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(document.querySelector(".SearchPageFooter-actions"), select);
        }
      }
    },
    551(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => HDB
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(511);
      var common_searcher__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(346);
      var common_trackers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(175);
      const isExclusive = element => {
        const exclusiveLink = element.querySelector('a[href="/browse.php?exclusive=1"]');
        return null != exclusiveLink;
      };
      function parseTorrent(element) {
        const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element.querySelector("td:nth-child(6)")?.textContent);
        const title = element.querySelector(".browse_td_name_cell a")?.textContent?.trim();
        const resolution = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.sG)(title);
        const tags = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.rL)(title);
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
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE;

         case "2":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.TV;

         case "3":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.DOCUMENTARY;

         case "4":
         case "6":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MUSIC;

         case "5":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.SPORT;

         case "7":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.XXX;
        }
      }
      class HDB extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Xt)(element.querySelector("a[data-imdb-link]")?.getAttribute("data-imdb-link"));
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uU)(element.children[2].querySelector("a")?.textContent);
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
            common_logger__WEBPACK_IMPORTED_MODULE_3__.v.info("[{0}] Error occurred while parsing torrent: " + e, this.name());
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
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
          const result = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_4__.$P)(common_trackers__WEBPACK_IMPORTED_MODULE_5__.hYc, {
            movie_title: "",
            movie_imdb_id: request.imdbId
          });
          if (result == common_searcher__WEBPACK_IMPORTED_MODULE_4__.q0.LOGGED_OUT) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_LOGGED_IN;
          return result == common_searcher__WEBPACK_IMPORTED_MODULE_4__.q0.NOT_FOUND ? _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.EXIST;
        }
        insertTrackersSelect(select) {
          const targetElement = document.querySelector("#moresearch3 > td:nth-child(2)");
          if (targetElement) {
            targetElement.innerHTML += "<br><br>Find unique for:<br>";
            (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(targetElement, select);
          } else common_logger__WEBPACK_IMPORTED_MODULE_3__.v.info("[{0}] Can add search select", this.name());
        }
      }
    },
    436(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => HDSky
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(553);
      class HDSky extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(element.querySelector(".torrentname"));
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element.children[6]?.textContent);
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
          if (request.category === _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE) {
            const movieRequest = request;
            const queryUrl = "https://hdsky.me/torrents.php?seeders=&medium13=1&medium1=1&incldead=0&spstate=0&inclbookmarked=0&search=" + movieRequest.imdbId + "&search_area=4&search_mode=0";
            const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_3__.Wx)(queryUrl);
            let notFound = null === result.querySelector(".torrentname");
            if (notFound) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_EXIST;
            return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.EXIST;
          }
        }
        insertTrackersSelect(select) {
          const element = document.querySelector(".searchbox").children[2].querySelector("td td.rowfollow tr");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(element, select);
        }
      }
    },
    653(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => HDT
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      class HDT extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
          document.querySelectorAll('table.mainblockcontenttt tr a[href^="details.php?id="]')?.forEach(element => {
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(element.closest("td"));
            let line = element.closest("tr");
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(line.children[7]?.textContent);
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
          });
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.HN)(requests);
        }
        name() {
          return "HDT";
        }
        async search(request) {
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          const element = document.querySelectorAll(".mainblockcontentsearch tr")[2];
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(element, select);
        }
      }
    },
    146(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => CG
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(553);
      const parseCategory = element => {
        let categoryImg = element.children[0].querySelector("img");
        const categoryLogo = categoryImg.src;
        const alt = categoryImg.alt;
        if (categoryLogo.includes("Movies-") || alt.includes("Movie")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE;
        if (categoryLogo.includes("TV-")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.TV;
        if (categoryLogo.includes("Music-")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MUSIC;
      };
      class CG extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element.children[5].textContent);
            if (category == _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE) {
              let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_3__.Wx)(link.href);
              const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(response);
              const {year, title} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uU)(torrentTitle);
              request = {
                ...request,
                torrents: [ {
                  dom: element,
                  size,
                  resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.sG)(torrentTitle),
                  tags: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.rL)(torrentTitle)
                } ],
                year,
                imdbId,
                title
              };
            } else if (category == _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MUSIC) {
              const splittedTitle = torrentTitle.split("-");
              const artists = [ splittedTitle[0] ];
              const titles = [ splittedTitle[1] ];
              const year = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.zL)(torrentTitle);
              const {container, format} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.v)(torrentTitle);
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
                type: _tracker__WEBPACK_IMPORTED_MODULE_1__.jh.ALBUM
              };
            }
            yield request;
          }
        }
        name() {
          return "IPT";
        }
        async search(request) {
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.WH)(select, document.querySelector('input[name="q"]'));
        }
      }
    },
    393(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => JPTV
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(553);
      var common_logger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(511);
      var common_searcher__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(346);
      class JPTV extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
            let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_3__.Wx)(element.href);
            let imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(response);
            if (!imdbId) {
              const tmdb = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.cF)(response);
              if (tmdb) {
                common_logger__WEBPACK_IMPORTED_MODULE_4__.v.debug("{0} Will try find ImdbId from TmdbId {1}", this.name(), tmdb);
                imdbId = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_5__.Iu)(tmdb);
              }
            }
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element?.parentElement?.parentElement?.children[7]?.textContent?.trim());
            let torrentTitle = element.textContent.trim();
            let {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uU)(response.querySelector("h1.movie-heading")?.textContent?.replaceAll(/\s+/g, " ")?.trim());
            if (!title) {
              const titleAndYear = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uU)(torrentTitle);
              if (titleAndYear) {
                title = titleAndYear.title;
                year = titleAndYear.year;
              }
            }
            const request = {
              torrents: [ {
                size,
                tags: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.rL)(torrentTitle),
                resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.sG)(torrentTitle),
                container: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Od)(torrentTitle),
                releaseGroup: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.yW)(torrentTitle),
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
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          if (window.location.toString().indexOf("/filter") > -1) (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(document.querySelector("ul.pagination"), select); else (0, 
          common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(document.querySelector(".form-torrent-search"), select);
        }
      }
    },
    488(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => JPop
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      const parseYear = element => {
        const text = element.children[3].textContent.trim();
        const match = text.match(/\[(\d{4})(\.\d{2}\.\d{2})?]/);
        return match ? parseInt(match[1]) : null;
      };
      const parseType = element => {
        const type = element.children[1].textContent.trim();
        if ("Album" == type) return _tracker__WEBPACK_IMPORTED_MODULE_1__.jh.ALBUM;
        if ("TV-Music" == type) return _tracker__WEBPACK_IMPORTED_MODULE_1__.jh.TV_MUSIC;
        return null;
      };
      const parseTorrents = element => {
        if (element.classList.contains("torrent_redline")) {
          const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element.children[6].textContent);
          const {format, container} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.v)(element.children[3].textContent.trim());
          return [ {
            size,
            dom: element,
            format,
            container
          } ];
        } else {
          const groupId = element.querySelector('a[title*="View Torrent"]').href.split("id=")[1];
          return Array.from(document.querySelectorAll(`tr.groupid_${groupId}`)).map(element => {
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element.children[3].textContent);
            const {format, container} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.v)(element.children[0].textContent.trim());
            return {
              size,
              dom: element,
              format,
              container
            };
          });
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
      class JPop extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
              category: _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MUSIC
            };
            yield request;
          }
        }
        name() {
          return "JPop";
        }
        async search(request) {
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          const element = document.querySelector('div.submit input[type="submit"]');
          if (element) (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.nc)(select, element);
        }
      }
    },
    15(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => KG
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_searcher__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(346);
      var common_trackers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(175);
      const parseCategory = element => {
        const category = _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE;
        let img = element.querySelectorAll("td img")[0];
        const imageSrc = img.getAttribute("src");
        if (imageSrc?.includes("40.jpg")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.AUDIOBOOK;
        if (imageSrc?.includes("41.jpg")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.BOOK;
        if (img.getAttribute("title")?.includes("Music")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MUSIC;
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
        const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element.querySelector("td:nth-child(11)")?.textContent?.replace(",", ""));
        let resolution;
        let format;
        if (element.querySelector('td img[src*="hdrip1080.png"]')) resolution = _tracker__WEBPACK_IMPORTED_MODULE_1__.jg.FHD; else if (element.querySelector('td img[src*="hdrip720.png"]')) resolution = _tracker__WEBPACK_IMPORTED_MODULE_1__.jg.HD; else if (element.querySelector('td img[src*="dvdr.png"]')) {
          resolution = _tracker__WEBPACK_IMPORTED_MODULE_1__.jg.SD;
          format = "VOB IFO";
        } else if (element.querySelector('td img[src*="bluray.png"]')) {
          resolution = _tracker__WEBPACK_IMPORTED_MODULE_1__.jg.FHD;
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
      class KG extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
          let elements = Array.from(document.querySelectorAll("#browse > tbody tr")).filter(element => null != element.querySelector("td:nth-child(2) > div > span:nth-child(1)"));
          yield {
            total: elements.length
          };
          for (let element of elements) {
            let linksContainer = element.querySelector("td:nth-child(2) > div > span:nth-child(1)");
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(linksContainer);
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
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
          const result = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_3__.$P)(common_trackers__WEBPACK_IMPORTED_MODULE_4__.KG, {
            movie_title: "",
            movie_imdb_id: request.imdbId
          });
          if (result == common_searcher__WEBPACK_IMPORTED_MODULE_3__.q0.LOGGED_OUT) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_LOGGED_IN;
          return result == common_searcher__WEBPACK_IMPORTED_MODULE_3__.q0.NOT_FOUND ? _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.EXIST;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.nc)(select, document.getElementById("showdead"));
        }
      }
    },
    965(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => LatTeam
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      const parseCategory = element => {
        const icon = element.querySelector(".torrent-search--list__category i");
        if (!icon) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.OTHER;
        if (icon?.classList.contains("fa-film")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE;
        if (icon?.classList.contains("fa-tv-retro")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.TV;
        return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.OTHER;
      };
      class LatTeam extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
        canBeUsedAsSource() {
          return true;
        }
        canBeUsedAsTarget() {
          return false;
        }
        canRun(url) {
          return url.includes("lat-team.com") && !url.includes("/similar");
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
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uU)(fullTitle);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element.querySelector(".torrent-search--list__size")?.textContent?.trim());
            const tags = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.rL)(fullTitle);
            const category = parseCategory(element);
            const resolution = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.sG)(element.querySelector(".torrent-search--list__resolution")?.textContent?.trim());
            const request = {
              torrents: [ {
                dom: element,
                size,
                tags,
                resolution,
                container: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Od)(fullTitle)
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
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(document.querySelector(".panelV2.torrent-search__results .panel__actions"), select);
        }
      }
    },
    43(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => MTeam
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      const isTV = title => {
        const tvPatterns = [ /S\d{2}E\d{2}/i, /S\d{2}/i, /EP\d{2,3}/i ];
        return tvPatterns.some(pattern => pattern.test(title));
      };
      const getCategory = element => {
        let categoryTitle = element.querySelector("img")?.getAttribute("title")?.toLocaleLowerCase();
        if (categoryTitle?.includes("anime")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.ANIME;
        if (categoryTitle?.includes("misc")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.OTHER;
        const title = element.querySelector(".torrentname a")?.getAttribute("title");
        let category = _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE;
        if (title && isTV(title)) category = _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.TV;
        return category;
      };
      class MTeam extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
          let elements = Array.from(document.querySelectorAll(".torrents")[0].children[0].children).filter(element => element.querySelector(".torrentname"));
          yield {
            total: elements.length
          };
          for (const element of elements) {
            let imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(element.querySelector(".torrentname"));
            if (imdbId) imdbId = imdbId.replace("tt0", "tt");
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element.children[6]?.textContent);
            const fullTitle = element.querySelector(".torrentname a")?.getAttribute("title");
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uU)(fullTitle);
            let category = getCategory(element);
            const request = {
              torrents: [ {
                size,
                tags: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.rL)(fullTitle),
                resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.sG)(fullTitle),
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
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          const element = document.querySelector(".searchbox")?.children[2].querySelector("td td.rowfollow tr");
          if (element) (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(element, select);
        }
      }
    },
    633(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => NewInsane
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      class NewInsane extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
          document.querySelectorAll("table.torrenttable tr.torrentrow").forEach(element => {
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(element);
            const request = {
              torrents: [],
              dom: [ element ],
              imdbId,
              title: ""
            };
            requests.push(request);
          });
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.HN)(requests);
        }
        name() {
          return "NewInsane";
        }
        async search(request) {
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(document.querySelector(".searchbuttons.actiontitle"), select);
        }
      }
    },
    665(module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
        try {
          __webpack_require__.d(__webpack_exports__, {
            A: () => PTP
          });
          var _utils_cache__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(867);
          var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(556);
          var _tracker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(281);
          var common_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(255);
          var common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(553);
          var common_logger__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(511);
          var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([ _utils_cache__WEBPACK_IMPORTED_MODULE_0__ ]);
          var __webpack_async_dependencies_result__ = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
          _utils_cache__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
          const BANNED_RELEASE_GROUPS = [ "aXXo", "BMDRu", "BRrip", "CM8", "CrEwSaDe", "CTFOH", "d3g", "DNL", "FaNGDiNG0", "HD2DVD", "HDTime", "ION10", "iPlanet", "KiNGDOM", "mHD", "mSD", "nHD", "nikt0", "nSD", "NhaNc3", "OFT", "PRODJi", "SANTi", "SPiRiT", "STUTTERSHIT", "ViSION", "VXT", "WAF", "x0r", "YIFY", "OFT", "BHDStudio", "nikt0", "HDT", "LAMA", "WORLD", "SasukeducK", "SPiRiT" ];
          function isSupportedCategory(category) {
            return void 0 === category || category === _tracker__WEBPACK_IMPORTED_MODULE_2__.b7.MOVIE || category === _tracker__WEBPACK_IMPORTED_MODULE_2__.b7.DOCUMENTARY || category === _tracker__WEBPACK_IMPORTED_MODULE_2__.b7.LIVE_PERFORMANCE;
          }
          const parseTorrents = element => {
            const torrents = [];
            if (element.classList.contains("cover-movie-list__movie")) return [];
            element.querySelectorAll("tr.basic-movie-list__torrent-row").forEach(element => {
              if (element.querySelector(".basic-movie-list__torrent-edition")) return;
              const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.DB)(element.children[2].textContent);
              let title = element.querySelector(".torrent-info-link").textContent;
              const resolution = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.sG)(title);
              const tags = [];
              if (title.includes("Remux")) tags.push("Remux");
              const torrent = {
                dom: element,
                size,
                tags,
                resolution
              };
              torrents.push(torrent);
            });
            return torrents;
          };
          const parseCategory = element => {
            const categoryTitle = element.querySelector(".basic-movie-list__torrent-edition__main")?.textContent;
            if (!categoryTitle) return null;
            if (categoryTitle.includes("Stand-up Comedy ")) return _tracker__WEBPACK_IMPORTED_MODULE_2__.b7.STAND_UP; else if (categoryTitle.includes("Live Performance ")) return _tracker__WEBPACK_IMPORTED_MODULE_2__.b7.LIVE_PERFORMANCE; else return _tracker__WEBPACK_IMPORTED_MODULE_2__.b7.MOVIE;
          };
          const hasRequests = element => true === element.querySelector("#no_results_message")?.textContent?.trim().includes("Your search did not match any torrents, however it did match these requests.");
          const isAllowedTorrent = torrent => {
            if ("x265" === torrent.container && torrent.resolution !== _tracker__WEBPACK_IMPORTED_MODULE_2__.jg.UHD && !isHDR(torrent)) {
              common_logger__WEBPACK_IMPORTED_MODULE_5__.v.debug("[PTP] Torrent not allowed: non HDR X265 and not 2160p");
              return false;
            }
            if (BANNED_RELEASE_GROUPS.includes(torrent.releaseGroup)) {
              common_logger__WEBPACK_IMPORTED_MODULE_5__.v.debug(`[PTP] Torrent not allowed: banned release group: ${torrent.releaseGroup}`);
              return false;
            }
            return true;
          };
          class PTP extends _tracker__WEBPACK_IMPORTED_MODULE_2__.$h {
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
              const nodes = (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.i8)(document.body, "#torrents-movie-view table.torrent_table > tbody", "table.torrent_table > tbody tr.basic-movie-list__details-row", ".cover-movie-list__movie");
              yield {
                total: nodes.length
              };
              for (let element of nodes) {
                let elements = (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.i8)(element, ".basic-movie-list__movie__ratings-and-tags", ".cover-movie-list__movie__rating-and-tags");
                const imdbId = elements ? (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.FK)(elements[0]) : null;
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
              if (!this.isAllowed(request)) return _tracker__WEBPACK_IMPORTED_MODULE_2__.q0.NOT_ALLOWED;
              if (0 === request.torrents.filter(torrent => isAllowedTorrent(torrent)).length) return _tracker__WEBPACK_IMPORTED_MODULE_2__.q0.NOT_ALLOWED;
              let torrents = [];
              let result;
              const moviesRequest = request;
              if (!moviesRequest.imdbId) {
                common_logger__WEBPACK_IMPORTED_MODULE_5__.v.debug("NO IMDB ID was provided");
                if (moviesRequest.title && moviesRequest.year) {
                  common_logger__WEBPACK_IMPORTED_MODULE_5__.v.debug("Searching by title and year: {0} - {1}", moviesRequest.title, moviesRequest.year);
                  const query_url = `https://passthepopcorn.me/torrents.php?action=advanced&searchstr=${encodeURIComponent(moviesRequest.title)}&year=${moviesRequest.year}`;
                  result = await (0, common_http__WEBPACK_IMPORTED_MODULE_4__.Wx)(query_url);
                  let searchResultsCount = result.querySelector("span.search-form__footer__results");
                  if (searchResultsCount && "0" !== searchResultsCount.textContent?.trim()?.split(" ")[0]) {
                    common_logger__WEBPACK_IMPORTED_MODULE_5__.v.debug("[PTP] Multiple results found: {0}", searchResultsCount.textContent);
                    const torrentsData = extractJsonData(result);
                    for (let movie of torrentsData.Movies) {
                      common_logger__WEBPACK_IMPORTED_MODULE_5__.v.debug("[PTP] Found search result: {0}", movie);
                      if (movie.Title.trim() === moviesRequest.title && parseInt(movie.Year.trim()) === moviesRequest.year) {
                        common_logger__WEBPACK_IMPORTED_MODULE_5__.v.debug("[PTP] Found a title with 100% match");
                        for (let group of movie.GroupingQualities) for (let torrent of group.Torrents) torrents.push({
                          size: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.DB)(torrent.Size),
                          tags: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.rL)(torrent.Title),
                          resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.sG)(torrent.Title),
                          container: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Od)(torrent.Title)
                        });
                        common_logger__WEBPACK_IMPORTED_MODULE_5__.v.debug("[PTP] Parsed torrents: {0}", torrents);
                        break;
                      }
                    }
                  } else torrents = parseAvailableTorrents(result);
                } else return _tracker__WEBPACK_IMPORTED_MODULE_2__.q0.NOT_CHECKED;
              } else {
                torrents = (0, _utils_cache__WEBPACK_IMPORTED_MODULE_0__.Ai)(moviesRequest.imdbId);
                if (!torrents) {
                  const query_url = "https://passthepopcorn.me/torrents.php?imdb=" + moviesRequest.imdbId;
                  result = await (0, common_http__WEBPACK_IMPORTED_MODULE_4__.Wx)(query_url);
                  torrents = parseAvailableTorrents(result);
                  (0, _utils_cache__WEBPACK_IMPORTED_MODULE_0__.aQ)(moviesRequest.imdbId, torrents);
                }
              }
              let notFound = !torrents.length;
              if (notFound) {
                if (result && hasRequests(result)) if (moviesRequest.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_2__.q0.NOT_EXIST_WITH_REQUEST; else return _tracker__WEBPACK_IMPORTED_MODULE_2__.q0.MAYBE_NOT_EXIST_WITH_REQUEST;
                if (moviesRequest.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_2__.q0.NOT_EXIST; else return _tracker__WEBPACK_IMPORTED_MODULE_2__.q0.MAYBE_NOT_EXIST;
              }
              let searchResult = _tracker__WEBPACK_IMPORTED_MODULE_2__.q0.EXIST;
              for (let torrent of moviesRequest.torrents) if (searchTorrent(torrent, torrents)) searchResult = _tracker__WEBPACK_IMPORTED_MODULE_2__.q0.EXIST_BUT_MISSING_SLOT; else torrent.dom.style.display = "none";
              return searchResult;
            }
            isAllowed(request) {
              if (!isSupportedCategory(request.category)) return false;
              return true;
            }
            insertTrackersSelect(select) {
              let element = document.querySelector(".search-form__footer__buttons");
              if (!element) return;
              (0, common_dom__WEBPACK_IMPORTED_MODULE_3__.nc)(select, element);
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
              const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.DB)(line.children[1]?.textContent?.trim());
              const tags = [];
              if (line.textContent?.includes("Remux")) tags.push("Remux");
              const torrent = {
                container: data[0].split("]")[1].trim(),
                format: data[1].trim(),
                resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.sG)(data[3].trim()),
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
            const similarTorrents = availableTorrents.filter(e => sameResolution(torrent, e) && (void 0 === torrent.container || sameContainer(e.container, torrent.container)) && (!torrent.tags?.includes("Remux") || e.tags?.includes("Remux")));
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
      });
    },
    838(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => Pter
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(553);
      function parseTorrent(element) {
        const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element.childNodes[6].textContent);
        const title = element.querySelector(".torrentname a").textContent.trim();
        let resolution = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.sG)(title);
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
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE;

         case "402":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.DOCUMENTARY;

         case "403":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.ANIME;

         case "404":
         case "405":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.TV;

         case "406":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MUSIC;

         case "407":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.SPORT;

         case "408":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.BOOK;

         case "409":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.GAME;

         case "411":
          {
            const source = element.children[0].children[1].querySelector("img").getAttribute("title").toLocaleUpperCase();
            switch (source) {
             case "PDF":
             case "MOBI":
             case "EPUB":
              return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.BOOK;
            }
            return null;
          }

         case "413":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MV;

         case "418":
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.LIVE_PERFORMANCE;
        }
      }
      const isExclusive = element => {
        const torrentName = element.querySelector(".torrentname");
        const exclusiveLink = torrentName.querySelector('a[href="torrents.php?tag_exclusive=yes"]');
        return null != exclusiveLink;
      };
      class Pter extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
            const {title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uU)(element.querySelector(".torrentname a").textContent.trim());
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
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
          const queryUrl = `https://pterclub.com/torrents.php?search=${request.imdbId}`;
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_3__.Wx)(queryUrl);
          return null === result.querySelector("#torrenttable") ? _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.EXIST;
        }
        insertTrackersSelect(select) {
          const targetLine = document.querySelector(".searchbox > tbody:last-child table tr");
          if (!targetLine) return;
          const td = document.createElement("td");
          td.classList.add("embedded");
          td.appendChild(select);
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(targetLine, td);
        }
      }
    },
    74(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => RED
      });
      var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(281);
      var common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(553);
      var common_logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(511);
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
      class RED extends _tracker__WEBPACK_IMPORTED_MODULE_0__.$h {
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
          if (request.category != _tracker__WEBPACK_IMPORTED_MODULE_0__.b7.MUSIC) return _tracker__WEBPACK_IMPORTED_MODULE_0__.q0.NOT_ALLOWED;
          const musicRequest = request;
          if (musicRequest.type != _tracker__WEBPACK_IMPORTED_MODULE_0__.jh.ALBUM && musicRequest.type != _tracker__WEBPACK_IMPORTED_MODULE_0__.jh.SINGLE) return _tracker__WEBPACK_IMPORTED_MODULE_0__.q0.NOT_ALLOWED;
          if (!musicRequest.artists || !musicRequest.titles || !musicRequest.year) {
            common_logger__WEBPACK_IMPORTED_MODULE_2__.v.debug("[{0}] Not enough data to check request: {1}", this.name(), request);
            return _tracker__WEBPACK_IMPORTED_MODULE_0__.q0.NOT_CHECKED;
          }
          for (let artist of musicRequest.artists) for (let title of musicRequest.titles) {
            if ("VA" === artist) artist = "";
            if (artist) {
              const queryUrl = `https://redacted.sh/artist.php?artistname=${encodeURIComponent(artist)}`;
              const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_1__.Wx)(queryUrl);
              if (result.textContent?.includes("Your search did not match anything.") || result.querySelector("#search_terms")) return _tracker__WEBPACK_IMPORTED_MODULE_0__.q0.NOT_EXIST;
              const torrents = parseTorrents(result);
              common_logger__WEBPACK_IMPORTED_MODULE_2__.v.debug("[{0}] Parsed following torrents for artist: {1}: {2}", this.name(), artist, torrents);
              for (let torrent of torrents) if (torrent.year == request.year && titlesAreEqual(title, torrent.title)) return _tracker__WEBPACK_IMPORTED_MODULE_0__.q0.EXIST;
            }
          }
          return _tracker__WEBPACK_IMPORTED_MODULE_0__.q0.NOT_EXIST;
        }
        insertTrackersSelect(select) {}
      }
    },
    611(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => SC
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(553);
      function parseTorrent(element) {
        let infos = element.querySelector(".torrent_info .activity_info").querySelectorAll("div");
        let size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(infos[1].textContent);
        let resolution = infos[0]?.textContent?.trim();
        if ("CD" == resolution || "WEB" == resolution) resolution = void 0;
        let format;
        if ("DVD-R" === resolution) {
          resolution = _tracker__WEBPACK_IMPORTED_MODULE_1__.jg.SD;
          format = "VOB IFO";
        }
        return {
          size,
          tags: [],
          dom: element,
          resolution: resolution ? (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.sG)(resolution) : void 0,
          format
        };
      }
      function parseCategory(element) {
        let category = _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE;
        let infos = element.querySelector(".torrent_info .activity_info").querySelectorAll("div");
        let info = infos[0].textContent;
        if ("CD" == info || "WEB" === info) category = _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MUSIC; else if (element.querySelector(".torrent_tags").textContent.includes("ebook")) category = _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.BOOK;
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
      class SC extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
          const elements = Array.from(document.querySelectorAll(".torrent_card")).filter(element => null != element.querySelector(".torrent_tags"));
          yield {
            total: elements.length
          };
          for (let element of elements) {
            let links_container = element.querySelector(".torrent_tags");
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(links_container);
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
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
          const queryUrl = `https://secret-cinema.pw/torrents.php?action=advanced&searchsubmit=1&cataloguenumber=${request.imdbId}&order_by=time&order_way=desc&tags_type=0`;
          const result = await (0, common_http__WEBPACK_IMPORTED_MODULE_3__.Wx)(queryUrl);
          return null === result.querySelector(".torrent_card_container") ? _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.EXIST;
        }
        insertTrackersSelect(select) {
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(document.querySelector("#ft_container p"), select);
        }
      }
    },
    429(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => TL
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(511);
      const parseCategory = element => {
        let categoryLink = element.querySelector(".info a.category");
        const category = categoryLink.getAttribute("data-ccid");
        if ("animation" == category) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.ANIME;
        if ("tv" == category) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.TV;
        if ("music" == category) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MUSIC;
        if ("games" == category) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.GAME;
        if ("movies" == category) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE;
        if ("books" == category) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.BOOK;
        if (categoryLink.textContent.trim().includes("TV")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.TV;
      };
      class TL extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
          common_logger__WEBPACK_IMPORTED_MODULE_3__.v.debug("[{0}] Parsing titles to check", this.name());
          const elements = Array.from(document.querySelectorAll(".torrent"));
          yield {
            total: elements.length
          };
          for (let element of elements) {
            const torrentTitle = element.querySelector(".name a").childNodes[0].textContent;
            common_logger__WEBPACK_IMPORTED_MODULE_3__.v.debug("[TL] Checking torrent: {0}", torrentTitle);
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(element);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element.querySelector(".td-size")?.textContent);
            const category = parseCategory(element);
            let title;
            let year;
            if (category == _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE) ({title, year} = (0, 
            _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uU)(element.querySelector(".name a").childNodes[0].textContent));
            const request = {
              torrents: [ {
                size,
                tags: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.rL)(torrentTitle),
                dom: element,
                resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.sG)(torrentTitle),
                container: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Od)(torrentTitle),
                releaseGroup: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.yW)(torrentTitle)
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
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          select.style.margin = "20px 0";
          select.style.padding = "2px 2px 3px 2px";
          select.style.color = "#111";
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(document.querySelector(".sub-navbar"), select);
        }
      }
    },
    307(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => TNT
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(553);
      var common_logger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(511);
      const parseCategory = category => {
        if ([ 24, 18, 17, 20, 19, 34, 36, 45, 22, 37, 35, 43, 38, 39, 46 ].includes(category)) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE;
        if ([ 27, 28, 16, 2, 29, 40, 41, 42 ].includes(category)) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.TV;
        if ([ 10, 12, 13, 14 ].includes(category)) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.GAME;
        if ([ 1 ].includes(category)) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.AUDIOBOOK;
        if ([ 8 ].includes(category)) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.BOOK;
        if ([ 2, 41 ].includes(category)) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.ANIME;
        if ([ 44, 25, 26 ].includes(category)) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MUSIC;
      };
      const getTorrentTitle = element => {
        const h5 = element.children[1].querySelector("h5");
        const newTag = h5.querySelector(".newTag");
        if (newTag) h5.removeChild(newTag);
        return h5.textContent;
      };
      class TNT extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
          common_logger__WEBPACK_IMPORTED_MODULE_4__.v.debug("[{0}] Parsing titles to check", this.name());
          const elements = Array.from(document.querySelectorAll("#table_gen_wrapper .sTable tbody tr"));
          yield {
            total: elements.length
          };
          for (let element of elements) {
            const torrentTitle = getTorrentTitle(element);
            common_logger__WEBPACK_IMPORTED_MODULE_4__.v.debug("[TNT] Checking torrent: {0}", torrentTitle);
            const torrentId = element.children[1].querySelector("a").href.split("/").pop();
            const token = JSON.parse(localStorage.getItem("ngStorage-token"));
            const data = await (0, common_http__WEBPACK_IMPORTED_MODULE_3__.z$)(`https://tntracker.org/api/torrent?id=${torrentId}`, {
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
            if (category == _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE) {
              ({title, year} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.uU)(torrentTitle));
              request = {
                ...request,
                torrents: [ {
                  size,
                  tags: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.rL)(torrentTitle),
                  dom: element,
                  resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.sG)(torrentTitle),
                  container: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Od)(torrentTitle)
                } ],
                year,
                title: title?.replace(".", " "),
                imdbId
              };
            } else if (category == _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MUSIC) {
              const splittedTitle = torrentTitle.split("-");
              const artists = [ splittedTitle[0].replaceAll("_", " ") ];
              const titles = [ splittedTitle[1].replaceAll("_", " ") ];
              const year = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.zL)(torrentTitle);
              const {container, format} = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.v)(torrentTitle);
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
                type: _tracker__WEBPACK_IMPORTED_MODULE_1__.jh.ALBUM
              };
            }
            yield request;
          }
        }
        name() {
          return "TNT";
        }
        async search(request) {
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
        }
        async insertTrackersSelect(select) {
          await (0, common_http__WEBPACK_IMPORTED_MODULE_3__.yy)(3e3);
          if (document.getElementById("find-unique-titles")) return;
          const form = document.getElementById("search").parentElement;
          const wrapper = document.createElement("div");
          wrapper.classList.add("selector");
          wrapper.id = "find-unique-titles";
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(wrapper, select);
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(form, wrapper);
        }
      }
    },
    248(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => TSeeds
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      var common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(553);
      var common_searcher__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(346);
      var common_trackers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(175);
      const parseCategory = element => {
        const icon = element.querySelector("i.torrent-icon");
        if (!icon) return;
        if (icon.classList.contains("fa-female")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.XXX;
        if (icon.classList.contains("fa-tv")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.TV;
        if (icon.classList.contains("fa-film")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE;
        if (icon.classList.contains("fa-music")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MUSIC;
        if (icon.classList.contains("fa-basketball-ball")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.SPORT;
        if (icon.classList.contains("fa-gamepad")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.GAME;
        return;
      };
      const parseYearAndTitle = element => {
        const spans = element.querySelectorAll("h1.movie-heading span");
        if (1 == spans.length) {
          const releaseName = element.querySelector('ol li.active span[itemprop="title"]').textContent.trim();
          return (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.gc)(releaseName);
        }
        const title = spans[0].textContent?.trim();
        let yearText = spans[1].textContent.trim();
        const year = parseInt(yearText.substring(1, yearText.length - 1), 10);
        return {
          title,
          year
        };
      };
      class TSeeds extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
            if (category == _tracker__WEBPACK_IMPORTED_MODULE_1__.b7.MOVIE) {
              const link = element.querySelector('a.view-torrent[href*="/torrents/"]');
              let response = await (0, common_http__WEBPACK_IMPORTED_MODULE_3__.Wx)(link.href);
              imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(response);
              ({title, year} = parseYearAndTitle(response));
            }
            let sizeText = element.querySelector(".torrent-listings-size span")?.textContent;
            if (isCategoryPage()) sizeText = element.children[7]?.textContent?.trim();
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(sizeText);
            const request = {
              torrents: [ {
                size,
                tags: [],
                dom: element,
                resolution: (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.sG)(element.querySelector("a.view-torrent").textContent)
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
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
          const result = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_4__.$P)(common_trackers__WEBPACK_IMPORTED_MODULE_5__.TSeeds, {
            movie_title: "",
            movie_imdb_id: request.imdbId
          });
          if (result == common_searcher__WEBPACK_IMPORTED_MODULE_4__.q0.LOGGED_OUT) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_LOGGED_IN;
          return result == common_searcher__WEBPACK_IMPORTED_MODULE_4__.q0.NOT_FOUND ? _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.EXIST;
        }
        insertTrackersSelect(select) {
          if (isCategoryPage()) (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(document.querySelector(".table-responsive.cat-torrents .text-center"), select); else {
            const wrapper = document.createElement("div");
            wrapper.classList.add("form-group", "col-xs-3");
            wrapper.appendChild(select);
            (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(document.querySelector("#torrent-list-search div.row"), wrapper);
          }
        }
      }
      const isCategoryPage = () => document.location.toString().includes("/categories/");
    },
    761(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => TiK
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_searcher__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(346);
      var common_trackers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(175);
      var common_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(255);
      class TiK extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
            let size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element.querySelector(".torrent-search--list__size").textContent);
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
          if (!request.imdbId) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
          const result = await (0, common_searcher__WEBPACK_IMPORTED_MODULE_2__.$P)(common_trackers__WEBPACK_IMPORTED_MODULE_3__.RdY, {
            movie_title: "",
            movie_imdb_id: request.imdbId
          });
          if (result == common_searcher__WEBPACK_IMPORTED_MODULE_2__.q0.LOGGED_OUT) return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_LOGGED_IN;
          return result == common_searcher__WEBPACK_IMPORTED_MODULE_2__.q0.NOT_FOUND ? _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_EXIST : _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.EXIST;
        }
        insertTrackersSelect(select) {
          select.classList.add("form__select");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_4__.oS)(document.querySelectorAll(".panel__actions")[1], select);
        }
      }
    },
    345(module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
        try {
          __webpack_require__.r(__webpack_exports__);
          __webpack_require__.d(__webpack_exports__, {
            CG: () => _CG__WEBPACK_IMPORTED_MODULE_5__.A,
            Cc: () => _JPop__WEBPACK_IMPORTED_MODULE_17__.A,
            FL: () => _FL__WEBPACK_IMPORTED_MODULE_10__.A,
            HJ: () => _BTarg__WEBPACK_IMPORTED_MODULE_4__.A,
            K$: () => _nCore__WEBPACK_IMPORTED_MODULE_30__.A,
            KG: () => _KG__WEBPACK_IMPORTED_MODULE_18__.A,
            KN: () => _Pter__WEBPACK_IMPORTED_MODULE_23__.A,
            M0: () => _BLU__WEBPACK_IMPORTED_MODULE_3__.A,
            MW: () => _HDSky__WEBPACK_IMPORTED_MODULE_13__.A,
            N2: () => _TNT__WEBPACK_IMPORTED_MODULE_27__.A,
            Rh: () => _NewInsane__WEBPACK_IMPORTED_MODULE_21__.A,
            Ry: () => _BHD__WEBPACK_IMPORTED_MODULE_2__.A,
            SC: () => _SC__WEBPACK_IMPORTED_MODULE_25__.A,
            TL: () => _TL__WEBPACK_IMPORTED_MODULE_26__.A,
            UH: () => _RED__WEBPACK_IMPORTED_MODULE_24__.A,
            WS: () => _IPT__WEBPACK_IMPORTED_MODULE_15__.A,
            X3: () => _AvistaZ__WEBPACK_IMPORTED_MODULE_1__.A,
            _A: () => _CinemaZ__WEBPACK_IMPORTED_MODULE_8__.A,
            dV: () => _TiK__WEBPACK_IMPORTED_MODULE_29__.A,
            e5: () => _CHD__WEBPACK_IMPORTED_MODULE_6__.A,
            fj: () => _DiscFan__WEBPACK_IMPORTED_MODULE_9__.A,
            h1: () => _HDT__WEBPACK_IMPORTED_MODULE_14__.A,
            h4: () => _JPTV__WEBPACK_IMPORTED_MODULE_16__.A,
            js: () => _TSeeds__WEBPACK_IMPORTED_MODULE_28__.A,
            jw: () => _GPW__WEBPACK_IMPORTED_MODULE_11__.A,
            mI: () => _Aither__WEBPACK_IMPORTED_MODULE_0__.A,
            pX: () => _LatTeam__WEBPACK_IMPORTED_MODULE_19__.A,
            t4: () => _MTeam__WEBPACK_IMPORTED_MODULE_20__.A,
            vD: () => _HDB__WEBPACK_IMPORTED_MODULE_12__.A,
            vc: () => _CLAN_SUD__WEBPACK_IMPORTED_MODULE_7__.A,
            vo: () => _PTP__WEBPACK_IMPORTED_MODULE_22__.A
          });
          var _Aither__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(680);
          var _AvistaZ__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(855);
          var _BHD__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(711);
          var _BLU__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(620);
          var _BTarg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(755);
          var _CG__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(127);
          var _CHD__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(384);
          var _CLAN_SUD__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(916);
          var _CinemaZ__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(262);
          var _DiscFan__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(535);
          var _FL__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(399);
          var _GPW__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(133);
          var _HDB__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(551);
          var _HDSky__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(436);
          var _HDT__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(653);
          var _IPT__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(146);
          var _JPTV__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(393);
          var _JPop__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(488);
          var _KG__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(15);
          var _LatTeam__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(965);
          var _MTeam__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(43);
          var _NewInsane__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(633);
          var _PTP__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(665);
          var _Pter__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(838);
          var _RED__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(74);
          var _SC__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(611);
          var _TL__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(429);
          var _TNT__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(307);
          var _TSeeds__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(248);
          var _TiK__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(761);
          var _nCore__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(368);
          var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([ _PTP__WEBPACK_IMPORTED_MODULE_22__ ]);
          var __webpack_async_dependencies_result__ = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
          _PTP__WEBPACK_IMPORTED_MODULE_22__ = __webpack_async_dependencies_result__[0];
          __webpack_async_result__();
        } catch (e) {
          __webpack_async_result__(e);
        }
      });
    },
    368(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        A: () => MTeam
      });
      var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(556);
      var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
      var common_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(255);
      class MTeam extends _tracker__WEBPACK_IMPORTED_MODULE_1__.$h {
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
            const imdbId = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.FK)(element);
            const size = (0, _utils_utils__WEBPACK_IMPORTED_MODULE_0__.DB)(element.children[1].children[4].textContent);
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
          yield* (0, _tracker__WEBPACK_IMPORTED_MODULE_1__.HN)(requests);
        }
        name() {
          return "nCore";
        }
        async search(request) {
          return _tracker__WEBPACK_IMPORTED_MODULE_1__.q0.NOT_CHECKED;
        }
        insertTrackersSelect(select) {
          const element = document.querySelector("#keresoresz tr");
          (0, common_dom__WEBPACK_IMPORTED_MODULE_2__.oS)(element, select);
        }
      }
    },
    281(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        $h: () => AbstractTracker,
        b7: () => Category,
        jg: () => Resolution,
        jh: () => MusicReleaseType,
        q0: () => SearchResult
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
      __webpack_require__.d(__webpack_exports__, [ "HN", 0, toGenerator ]);
    },
    867(module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
        try {
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
          __webpack_require__.d(__webpack_exports__, [ "Ai", 0, getFromMemoryCache, "Pn", 0, clearMemoryCache, "SW", 0, existsInCache, "aQ", 0, addToMemoryCache, "ls", 0, addToCache ]);
          __webpack_async_result__();
        } catch (e) {
          __webpack_async_result__(e);
        }
      }, 1);
    },
    589(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
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
        div.addEventListener("click", () => div.style.display = "none");
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
      __webpack_require__.d(__webpack_exports__, [ "I5", 0, addCounter, "L6", 0, updateCount, "N8", 0, updateTotalCount, "bG", 0, updateNewContent, "wZ", 0, createTrackersSelect ]);
    },
    556(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      var _trackers_tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(281);
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
          if (height < 720) return _trackers_tracker__WEBPACK_IMPORTED_MODULE_0__.jg.SD;
          if (height < 1080) return _trackers_tracker__WEBPACK_IMPORTED_MODULE_0__.jg.HD;
          if (height < 2160) return _trackers_tracker__WEBPACK_IMPORTED_MODULE_0__.jg.FHD;
          return _trackers_tracker__WEBPACK_IMPORTED_MODULE_0__.jg.UHD;
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
      __webpack_require__.d(__webpack_exports__, [ "DB", 0, parseSize, "FK", 0, parseImdbIdFromLink, "Od", 0, parseCodec, "Xt", 0, parseImdbId, "cF", 0, parseTmdbIdFromLink, "gc", 0, parseYearAndTitleFromReleaseName, "rL", 0, parseTags, "sG", 0, parseResolution, "uU", 0, parseYearAndTitle, "v", 0, parseContainerAndFormat, "yW", 0, parseReleaseGroup, "zL", 0, parseYear ]);
    },
    255(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
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
      __webpack_require__.d(__webpack_exports__, [ "Qg", 0, showError, "WH", 0, insertAfter, "WY", 0, appendErrorMessage, "i8", 0, findFirst, "nc", 0, insertBefore, "oS", 0, addChild ]);
    },
    553(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        Wx: () => fetchAndParseHtml,
        z$: () => fetchAndParseJson,
        QJ: () => fetchUrl,
        yy: () => sleep
      });
      var logger = __webpack_require__(511);
      function parseRawHeaders(h) {
        const s = h.trim();
        if (!s) return new Headers;
        const array = s.split("\r\n").map(value => {
          let s = value.split(":");
          return [ s[0].trim(), s[1].trim() ];
        });
        return new Headers(array);
      }
      function parseGMResponse(req, res) {
        const headers = parseRawHeaders(res.responseHeaders);
        const body = "string" == typeof res.response ? new Blob([ res.response ], {
          type: headers.get("Content-Type") || "text/plain"
        }) : res.response;
        return new ResImpl(body, {
          statusCode: res.status,
          statusText: res.statusText,
          headers,
          finalUrl: res.finalUrl,
          redirected: res.finalUrl === req.url
        });
      }
      class ResImpl {
        constructor(body, init) {
          this.rawBody = body;
          this.init = init;
          this.body = body.stream();
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
          return Promise.resolve(this.rawBody.slice(0, this.rawBody.size, this.rawBody.type));
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
        async bytes() {
          if (this.bodyUsed) throw new TypeError("Failed to execute 'bytes' on 'Response': body stream already read");
          this._bodyUsed = true;
          return new Uint8Array(await this.rawBody.arrayBuffer());
        }
      }
      function decode(body) {
        const form = new FormData;
        body.trim().split("&").forEach(function(bytes) {
          if (bytes) {
            const split = bytes.split("=");
            const name = split.shift()?.replace(/\+/g, " ");
            const value = split.join("=").replace(/\+/g, " ");
            form.append(decodeURIComponent(name), decodeURIComponent(value));
          }
        });
        return form;
      }
      async function GM_fetch(input, init) {
        const request = new Request(input, init);
        let data;
        if (init?.body) data = await request.text();
        return await XHR(request, init, data);
      }
      function XHR(request, init, data) {
        return new Promise((resolve, reject) => {
          if (request.signal && request.signal.aborted) return reject(new DOMException("Aborted", "AbortError"));
          GM.xmlHttpRequest({
            url: request.url,
            method: gmXHRMethod(request.method.toUpperCase()),
            headers: Object.fromEntries(new Headers(init?.headers).entries()),
            data,
            responseType: "blob",
            onload(res) {
              try {
                resolve(parseGMResponse(request, res));
              } catch (e) {
                reject(e);
              }
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
        });
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
        logger.v.debug("Will fetch {0}", input);
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
      const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    },
    511(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        B: () => LEVEL
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
        return `${logger.prefix} ${levelPrefix} "` + message.replace(/{(\d+)}/g, (match, index) => {
          const argIndex = parseInt(index, 10);
          const argValue = args[argIndex];
          return "object" == typeof argValue ? stringifyWithoutDOM(argValue) : argValue;
        }).trim();
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
      __webpack_require__.d(__webpack_exports__, [ "v", 0, logger ]);
    },
    346(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
      __webpack_require__.d(__webpack_exports__, {
        q0: () => SearchResult
      });
      var _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(553);
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
        if (now - lastLoaded < rate) await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.yy)(now - lastLoaded); else window.localStorage[domain + "_lastLoaded"] = (new Date).getTime();
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
          response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.QJ)(searchUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
              ...reqHeader
            },
            body: post_data
          });
        } else response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.QJ)(searchUrl, {
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
        const response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.QJ)(url);
        if (response.match("seriesid")) {
          const xmldata = (new DOMParser).parseFromString(response, "application/xml");
          return xmldata.getElementsByTagName("seriesid")[0].childNodes[0].nodeValue;
        }
        return "00000000";
      };
      const getTMDbID = async imdbID => {
        const url = "https://api.themoviedb.org/3/find/" + imdbID + "?api_key=d12b33d3f4fb8736dc06f22560c4f8d4&external_source=imdb_id";
        const response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.QJ)(url);
        const result = JSON.parse(response);
        if (result.movie_results && result.movie_results.length > 0) return result.movie_results[0].id; else if (result.tv_results && result.tv_results.length > 0) return result.tv_results[0].id; else if (result.tv_episode_results && result.tv_episode_results.length > 0) return result.tv_episode_results[0].id;
        return "00000000";
      };
      const getDoubanID0 = async imdbID => {
        const url = "https://movie.douban.com/j/subject_suggest?q=" + imdbID;
        const response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.QJ)(url);
        const result = JSON.parse(response);
        if (result && result.length) return result[0].id;
        return "00000000";
      };
      const getDoubanID1 = async imdbID => {
        const url = "https://www.douban.com/search?cat=1002&q=" + imdbID;
        const result = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.Wx)(url);
        const element = result.querySelector("[onclick*=" + imdbID + "]");
        if (element) {
          const href = element.getAttribute("href");
          if (href && href.match(/subject%2F(\d+)/)) return href.match(/subject%2F(\d+)/)[1];
        }
        return "00000000";
      };
      const getDoubanID2 = async imdbID => {
        const url = 'https://query.wikidata.org/sparql?format=json&query=SELECT * WHERE {?s wdt:P345 "' + imdbID + '". OPTIONAL { ?s wdt:P4529 ?Douban_film_ID. }}';
        const response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.QJ)(url);
        const result = JSON.parse(response);
        if (null != result.results.bindings[0]) if (null != result.results.bindings[0].Douban_film_ID) return result.results.bindings[0].Douban_film_ID.value;
        return "00000000";
      };
      const getDoubanID3 = async imdbID => {
        const url = 'https://www.google.com/search?q="' + imdbID + '" site:https://movie.douban.com/subject&safe=off';
        const result = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.QJ)(url);
        if (result.match("movie.douban.com/subject/")) {
          const x = result.split("movie.douban.com/subject/")[1];
          return x.split("/")[0];
        } else return "00000000";
      };
      const getImdbIdFromTmdbID = async tmdbId => {
        const url = `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids?api_key=d12b33d3f4fb8736dc06f22560c4f8d4`;
        const response = await (0, _http_index_mjs__WEBPACK_IMPORTED_MODULE_0__.QJ)(url);
        const result = JSON.parse(response);
        return result.imdb_id;
      };
      __webpack_require__.d(__webpack_exports__, [ "$P", 0, search, "Iu", 0, getImdbIdFromTmdbID ]);
    },
    175(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
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
        loggedOutRegex: /Cloudflare|Ray ID|Forgot your password/,
        matchRegex: /torrents\/download|torrent\/download|torrent-search--poster__poster/,
        seedingRegex: /fa-arrow-circle-up|torrent-activity-indicator--seeding/,
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
        loggedOutRegex: /Make sure your passcode generating|nginx|Scheduled Maintenance in progress/,
        matchRegex: /Nothing here!/,
        seedingRegex: /tag tag_seeding/,
        rateLimit: 250,
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
      const Tik = {
        name: "Tik",
        searchUrl: "https://cinematik.net/torrents?imdbId=%tt%",
        loggedOutRegex: /Cloudflare|Ray ID|Forgot Your Password|Forgot your password/,
        matchRegex: /torrents\/download|torrent\/download|torrent-search--poster__poster/,
        seedingRegex: /fa-arrow-circle-up|torrent-activity-indicator--seeding/,
        positiveMatch: true,
        both: true
      };
      __webpack_require__.d(__webpack_exports__, [ "AT", 0, AT, "CZ", 0, CZ, "KG", 0, KG, "RdY", 0, Tik, "e5O", 0, CHD, "hYc", 0, HDb, "mIQ", 0, Aither ]);
    }
  };
  const __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    const cachedModule = __webpack_module_cache__[moduleId];
    if (void 0 !== cachedModule) return cachedModule.exports;
    const module = __webpack_module_cache__[moduleId] = {
      exports: {}
    };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }
  (() => {
    const webpackQueues = Symbol("webpack queues");
    const webpackExports = Symbol("webpack exports");
    const webpackError = Symbol("webpack error");
    const resolveQueue = queue => {
      if (queue?.d < 1) {
        queue.d = 1;
        queue.forEach(fn => fn.r--);
        queue.forEach(fn => fn.r-- ? fn.r++ : fn());
      }
    };
    const wrapDeps = deps => deps.map(dep => {
      if (null !== dep && "object" == typeof dep) {
        if (dep[webpackQueues]) return dep;
        if (dep.then) {
          const queue = [];
          queue.d = 0;
          dep.then(r => {
            obj[webpackExports] = r;
            resolveQueue(queue);
          }, e => {
            obj[webpackError] = e;
            resolveQueue(queue);
          });
          const obj = {};
          obj[webpackQueues] = fn => fn(queue);
          return obj;
        }
      }
      const ret = {};
      ret[webpackQueues] = x => {};
      ret[webpackExports] = dep;
      return ret;
    });
    __webpack_require__.a = (module, body, hasAwait) => {
      let queue;
      hasAwait && ((queue = []).d = -1);
      const depQueues = new Set;
      const exports = module.exports;
      let currentDeps;
      let outerResolve;
      let reject;
      const promise = new Promise((resolve, rej) => {
        reject = rej;
        outerResolve = resolve;
      });
      promise[webpackExports] = exports;
      promise[webpackQueues] = fn => (queue && fn(queue), depQueues.forEach(fn), promise.catch(x => {}));
      module.exports = promise;
      const handle = deps => {
        currentDeps = wrapDeps(deps);
        let fn;
        const getResult = () => currentDeps.map(d => {
          if (d[webpackError]) throw d[webpackError];
          return d[webpackExports];
        });
        const promise = new Promise(resolve => {
          fn = () => resolve(getResult);
          fn.r = 0;
          const fnQueue = q => q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, 
          q.push(fn)));
          currentDeps.forEach(dep => dep[webpackQueues](fnQueue));
        });
        return fn.r ? promise : getResult();
      };
      const done = err => (err ? reject(promise[webpackError] = err) : outerResolve(exports), 
      resolveQueue(queue));
      body(handle, done);
      queue?.d < 0 && (queue.d = 0);
    };
  })();
  __webpack_require__.d = (exports, definition) => {
    if (Array.isArray(definition)) {
      var i = 0;
      for (;i < definition.length; ) {
        var key = definition[i++];
        var binding = definition[i++];
        var descriptor = 0 === binding ? {
          enumerable: true,
          value: definition[i++]
        } : {
          enumerable: true,
          get: binding
        };
        if (!__webpack_require__.o(exports, key)) Object.defineProperty(exports, key, descriptor);
      }
    } else for (var key in definition) if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) Object.defineProperty(exports, key, {
      enumerable: true,
      get: definition[key]
    });
  };
  __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
  __webpack_require__.r = exports => {
    Object.defineProperty(exports, Symbol.toStringTag, {
      value: "Module"
    });
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
  };
  __webpack_require__(767);
})();