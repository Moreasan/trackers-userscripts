// ==UserScript==
// @name Find Unique Titles
// @description Find unique titles to cross seed
// @version 0.0.1
// @author passthepopcorn_cc
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
// @grant GM.xmlHttpRequest
// @grant GM.setValue
// @grant GM.getValue
// @namespace http://tampermonkey.net/
// @require https://cdn.jsdelivr.net/npm/jquery@^3.6.4/dist/jquery.min.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _trackers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./trackers */ "./src/trackers/index.ts");
/* harmony import */ var _utils_cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/cache */ "./src/utils/cache.ts");
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/dom */ "./src/utils/dom.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_utils_cache__WEBPACK_IMPORTED_MODULE_1__]);
_utils_cache__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }




var deduplicateRequests = searchRequests => {
  var map = new Map();
  var requests = [];
  for (var request of searchRequests) {
    if (!request.imdbId) {
      requests.push(request);
      continue;
    }
    if (map[request.imdbId]) {
      var existingRequest = map[request.imdbId];
      for (var torrent of request.torrents) {
        existingRequest.torrents.push(torrent);
      }
    } else {
      map[request.imdbId] = request;
      requests.push(request);
    }
  }
  return requests;
};
function hideTorrents(request) {
  request.dom.style.display = "none";
  for (var torrent of request.torrents) {
    torrent.dom.style.display = "none";
  }
}
var main = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* () {
    "use strict";

    console.log("Init User script");
    /******************************************************************************/

    var only_show_unique_titles = false; // change to true if you wish
    var better_constant = 1.15; // you can change this too.. wouldn't recommend going below 1.05
    var useCache = false;

    /******************************************************************************/
    if (document.getElementById("tracker-select")) return;
    var url = window.location.href;
    var sourceTracker = null;
    var targetTrackers = [];
    Object.keys(_trackers__WEBPACK_IMPORTED_MODULE_0__).forEach(trackerName => {
      // @ts-expect-error
      var trackerImplementation = new _trackers__WEBPACK_IMPORTED_MODULE_0__[trackerName]();
      if (trackerImplementation.canRun(url)) {
        sourceTracker = trackerImplementation;
      } else if (trackerImplementation.canBeUsedAsTarget()) {
        targetTrackers.push(trackerImplementation);
      }
    });
    if (sourceTracker == null) return;
    var select = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_2__.createTrackersSelect)(targetTrackers.map(tracker => tracker.name()));
    select.addEventListener("change", /*#__PURE__*/_asyncToGenerator(function* () {
      var answer = confirm("Start searching new content for:  " + select.value);
      if (answer) {
        var targetTracker = targetTrackers.find(tracker => tracker.name() === select.value);
        var i = 1;
        var newContent = 0;
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_2__.showWaitingMessage)();
        var searchRequests = yield sourceTracker.getSearchRequest();
        searchRequests = deduplicateRequests(searchRequests);
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_2__.hideMessageBox)();
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_2__.addCounter)();
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_2__.updateTotalCount)(searchRequests.length);
        var _iteratorAbruptCompletion = false;
        var _didIteratorError = false;
        var _iteratorError;
        try {
          for (var _iterator = _asyncIterator(searchRequests), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false) {
            var request = _step.value;
            {
              (0,_utils_dom__WEBPACK_IMPORTED_MODULE_2__.updateCount)(i++);
              if (useCache && request.imdbId && (0,_utils_cache__WEBPACK_IMPORTED_MODULE_1__.existsInCache)(targetTracker.name(), request.imdbId)) {
                hideTorrents(request);
                continue;
              }
              var response = yield targetTracker.canUpload(request, only_show_unique_titles);
              if (!response) {
                if (request.imdbId) {
                  yield (0,_utils_cache__WEBPACK_IMPORTED_MODULE_1__.addToCache)(targetTracker.name(), request.imdbId);
                }
                hideTorrents(request);
              } else {
                newContent++;
                (0,_utils_dom__WEBPACK_IMPORTED_MODULE_2__.updateNewContent)(newContent);
              }
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (_iteratorAbruptCompletion && _iterator.return != null) {
              yield _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }));
    sourceTracker.insertTrackersSelect(select);
  });
  return function main() {
    return _ref.apply(this, arguments);
  };
}();
common__WEBPACK_IMPORTED_MODULE_3__["default"].dom.appendErrorMessage();
window.addEventListener("error", event => {
  common__WEBPACK_IMPORTED_MODULE_3__["default"].dom.showError(event.message);
});
window.onunhandledrejection = event => {
  console.trace(event.reason);
  common__WEBPACK_IMPORTED_MODULE_3__["default"].dom.showError(event.reason);
};
main().catch(e => {
  common__WEBPACK_IMPORTED_MODULE_3__["default"].dom.showError(e.message);
});
var currentUrl = document.location.href;
var observer = new MutationObserver( /*#__PURE__*/_asyncToGenerator(function* () {
  if (document.location.href !== currentUrl) {
    yield main();
  }
}));
var config = {
  subtree: true,
  childList: true
};
observer.observe(document, config);
window.addEventListener("beforeunload", function () {
  observer.disconnect();
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ "./src/trackers/Aither.ts":
/*!********************************!*\
  !*** ./src/trackers/Aither.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Aither)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var requests = [];
      document.querySelectorAll(".panelV2 tbody tr").forEach(element => {
        var _element$querySelecto;
        var imdbId = (_element$querySelecto = element.querySelector("#imdb_id")) === null || _element$querySelecto === void 0 ? void 0 : _element$querySelecto.textContent.trim();
        var size = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(element.children[5].textContent);
        var request = {
          torrents: [{
            size,
            tags: [],
            dom: element
          }],
          dom: element,
          imdbId,
          query: ""
        };
        requests.push(request);
      });
      return requests;
    })();
  }
  name() {
    return "Aither";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      if (!request.imdbId) return true;
      var queryUrl = "https://aither.xyz/torrents?perPage=25&imdbId=" + request.imdbId + "&sortField=size";
      var result = yield common__WEBPACK_IMPORTED_MODULE_1__["default"].http.fetchAndParseHtml(queryUrl);
      return result.textContent.includes("There is no result in database for query");
    })();
  }
  insertTrackersSelect(select) {
    var parent = document.querySelector(".panelV2 .panel__header");
    var div = document.createElement("div");
    select.style.width = "170px";
    div.classList.add("form__group");
    select.classList.add("form__select");
    common__WEBPACK_IMPORTED_MODULE_1__["default"].dom.addChild(div, select);
    common__WEBPACK_IMPORTED_MODULE_1__["default"].dom.insertAfter(div, parent.querySelector("h2"));
  }
}

/***/ }),

/***/ "./src/trackers/AvistaZ.ts":
/*!*********************************!*\
  !*** ./src/trackers/AvistaZ.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AvistaZ)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var _document$querySelect;
      var requests = [];
      (_document$querySelect = document.querySelectorAll("#content-area > div.block > .row")) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.forEach(element => {
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element);
        var request = {
          torrents: [],
          dom: element,
          imdbId,
          query: ""
        };
        requests.push(request);
      });
      return requests;
    })();
  }
  name() {
    return "AvistaZ";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      var _result$textContent;
      if (!request.imdbId) return true;
      var queryUrl = "https://avistaz.to/movies?search=&imdb=" + request.imdbId;
      var result = yield common__WEBPACK_IMPORTED_MODULE_1__["default"].http.fetchAndParseHtml(queryUrl);
      return (_result$textContent = result.textContent) === null || _result$textContent === void 0 ? void 0 : _result$textContent.includes("No Movie found!");
    })();
  }
  insertTrackersSelect(select) {
    common__WEBPACK_IMPORTED_MODULE_1__["default"].dom.addChild(document.querySelector("#content-area > div.well.well-sm"), select);
  }
}

/***/ }),

/***/ "./src/trackers/BHD.ts":
/*!*****************************!*\
  !*** ./src/trackers/BHD.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BHD)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tracker */ "./src/trackers/tracker.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



var parseTorrents = element => {
  var torrents = [];
  element.querySelectorAll('tr[id^="resulttorrent"]').forEach(torrentElement => {
    var data = torrentElement.children[0].textContent.trim().split("/");
    var size = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(torrentElement.children[4].textContent.trim());
    var tags = [];
    if (torrentElement.textContent.includes("Remux")) {
      tags.push("Remux");
    }
    var torrent = {
      container: data[0].trim(),
      format: data[1].trim(),
      resolution: data[3].trim(),
      tags: tags,
      size,
      dom: torrentElement
    };
    torrents.push(torrent);
  });
  return torrents;
};
var parseCategory = element => {
  var html = element.children[0].innerHTML;
  if (html.includes("categories/tv")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.TV;else if (html.includes("categories/movies")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.MOVIE;
  return undefined;
};
var parseTorrentsFromTorrentsPage = () => {
  var requests = [];
  document.querySelectorAll('tr[id^="torrentposter"]').forEach(element => {
    var imdbId = null;
    var libraryId = element.getAttribute("library");
    if (libraryId) {
      var imdbElement = document.querySelector("#librarydiv".concat(libraryId));
      if (imdbElement) {
        imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(imdbElement);
      }
    }
    var tags = [];
    var torrentName = element.children[1].querySelector('a[id^="torrent"]').textContent;
    if (torrentName.toUpperCase().includes("REMUX")) {
      tags.push("Remux");
    }
    var torrent = {
      dom: element,
      size: (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(element.children[5].textContent),
      tags: tags,
      resolution: (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseResolution)(torrentName)
    };
    var torrents = [torrent];
    var request = {
      torrents: torrents,
      dom: element,
      imdbId,
      query: "",
      category: parseCategory(element)
    };
    requests.push(request);
  });
  return requests;
};
var parseTorrentsFromMoviesPage = () => {
  var requests = [];
  document.querySelectorAll(".bhd-meta-box").forEach(element => {
    var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element);
    var request = {
      torrents: parseTorrents(element),
      dom: element,
      imdbId,
      query: ""
    };
    requests.push(request);
  });
  return requests;
};
var isMoviesPage = () => {
  return window.location.href.includes("/movies");
};
var isTorrentsPage = () => {
  return window.location.href.includes("/torrents");
};
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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var requests = [];
      if (isMoviesPage()) {
        requests = parseTorrentsFromMoviesPage();
      } else if (isTorrentsPage()) {
        requests = parseTorrentsFromTorrentsPage();
      }
      return requests;
    })();
  }
  name() {
    return "BHD";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      if (!request.imdbId) return true;
      var queryUrl = "https://beyond-hd.me/library/movies?activity=&q=" + request.imdbId;
      var result = yield common__WEBPACK_IMPORTED_MODULE_2__["default"].http.fetchAndParseHtml(queryUrl);
      return result.querySelectorAll(".bhd-meta-box").length === 0;
    })();
  }
  insertTrackersSelect(select) {
    select.classList.add("beta-form-main");
    select.style.width = "170px";
    common__WEBPACK_IMPORTED_MODULE_2__["default"].dom.insertBefore(select, document.querySelector(".button-center"));
  }
}

/***/ }),

/***/ "./src/trackers/BLU.ts":
/*!*****************************!*\
  !*** ./src/trackers/BLU.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BLU)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var requests = [];
      document.querySelectorAll(".torrent-search--list__results tbody tr").forEach(element => {
        var imdbId = "tt" + element.getAttribute("data-imdb-id");
        var size = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(element.querySelector(".torrent-search--list__size").textContent);
        var request = {
          torrents: [{
            size,
            tags: [],
            dom: element
          }],
          dom: element,
          imdbId,
          query: ""
        };
        requests.push(request);
      });
      return requests;
    })();
  }
  name() {
    return "BLU";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      if (!request.imdbId) return true;
      var queryUrl = "https://blutopia.xyz/torrents?perPage=25&imdbId=" + request.imdbId + "&sortField=size";
      var result = yield common__WEBPACK_IMPORTED_MODULE_1__["default"].http.fetchAndParseHtml(queryUrl);
      return result.querySelector(".torrent-listings-no-result") !== null;
    })();
  }
  insertTrackersSelect(select) {
    select.classList.add("form__select");
    common__WEBPACK_IMPORTED_MODULE_1__["default"].dom.addChild(document.querySelectorAll(".panel__actions")[1], select);
  }
}

/***/ }),

/***/ "./src/trackers/BTarg.ts":
/*!*******************************!*\
  !*** ./src/trackers/BTarg.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BTarg)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var requests = [];
      var rows = document.querySelectorAll("tr.browsetable");
      for (var row of rows) {
        var link = row.querySelector('a[href*="details.php?id"]');
        if (!link) {
          continue;
        }
        if (link.href.includes("#")) {
          continue;
        }
        var response = yield common__WEBPACK_IMPORTED_MODULE_1__["default"].http.fetchAndParseHtml(link.href);
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbId)(response.textContent);
        var request = {
          torrents: [],
          dom: row,
          imdbId,
          query: ""
        };
        requests.push(request);
      }
      return requests;
    })();
  }
  name() {
    return "BTarg";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      return false;
    })();
  }
  insertTrackersSelect(select) {
    common__WEBPACK_IMPORTED_MODULE_1__["default"].dom.insertAfter(select, document.querySelector('select[name="inclfree"]'));
  }
}

/***/ }),

/***/ "./src/trackers/CG.ts":
/*!****************************!*\
  !*** ./src/trackers/CG.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CG)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tracker */ "./src/trackers/tracker.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



var parseCategory = element => {
  var text = element.textContent.toLowerCase();
  if (text.includes("ebook")) {
    return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.BOOK;
  }
  return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.MOVIE;
};
function parseTorrents(element) {
  var _element$querySelecto;
  var size = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)((_element$querySelecto = element.querySelector("td:nth-child(5)")) === null || _element$querySelecto === void 0 ? void 0 : _element$querySelecto.textContent);
  var container = undefined;
  var format = undefined;
  var resolution = "SD";
  var text = element.textContent.toLowerCase();
  if (text.includes("1080p")) {
    resolution = "1080p";
  } else if (text.includes("720p")) {
    resolution = "720p";
  } else if (text.includes("dvd-r")) {
    format = "VOB IFO";
  }
  return [{
    size,
    tags: [],
    dom: element,
    resolution,
    container,
    format
  }];
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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var _document$querySelect;
      var requests = [];
      (_document$querySelect = document.querySelectorAll("table.torrenttable tbody tr")) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.forEach(element => {
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element);
        var category = parseCategory(element);
        var request = {
          torrents: parseTorrents(element),
          dom: element,
          imdbId,
          query: "",
          category
        };
        requests.push(request);
      });
      return requests;
    })();
  }
  name() {
    return "CG";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      var _result$textContent;
      if (!request.imdbId) return true;
      var queryUrl = "https://cinemageddon.net/browse.php?search=" + request.imdbId + "&orderby=size&dir=DESC";
      var result = yield common__WEBPACK_IMPORTED_MODULE_2__["default"].http.fetchAndParseHtml(queryUrl);
      return (_result$textContent = result.textContent) === null || _result$textContent === void 0 ? void 0 : _result$textContent.includes("Nothing found!");
    })();
  }
  insertTrackersSelect(select) {
    common__WEBPACK_IMPORTED_MODULE_2__["default"].dom.addChild(document.querySelector(".embedded > p"), select);
  }
}

/***/ }),

/***/ "./src/trackers/CHD.ts":
/*!*****************************!*\
  !*** ./src/trackers/CHD.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CHD)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/dom */ "./src/utils/dom.ts");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var requests = [];
      var nodes = document.querySelectorAll('.torrents')[0].children[0].children;
      (0,_utils_dom__WEBPACK_IMPORTED_MODULE_2__.updateTotalCount)(nodes.length);
      var i = 1;
      for (var element of nodes) {
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_2__.updateCount)(i++);
        if (!element.querySelector(".torrentname")) {
          continue;
        }
        var link = element.querySelector('a[href*="details.php?id"]');
        if (!link) {
          continue;
        }
        var response = yield common__WEBPACK_IMPORTED_MODULE_1__["default"].http.fetchAndParseHtml(link.href);
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(response);
        var size = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(element.querySelector('.rowfollow:nth-child(5)').innerText);
        console.log("size:", size);
        var request = {
          torrents: [{
            size,
            tags: [],
            dom: element
          }],
          dom: element,
          imdbId,
          query: ""
        };
        requests.push(request);
      }
      return requests;
    })();
  }
  name() {
    return "CHD";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      return false;
    })();
  }
  insertTrackersSelect(select) {
    var element = document.querySelector(".searchbox").children[2].querySelector("td td.rowfollow tr");
    common__WEBPACK_IMPORTED_MODULE_1__["default"].dom.addChild(element, select);
  }
}

/***/ }),

/***/ "./src/trackers/CLAN-SUD.ts":
/*!**********************************!*\
  !*** ./src/trackers/CLAN-SUD.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CLANSUD)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var requests = [];
      var topics = document.querySelectorAll('div[data-tableid="topics"] table');
      for (var topic of topics) {
        if (topic.getAttribute("bgColor") != null && !topic.getAttribute("bgcolor") != null) {
          continue;
        }
        if (topic.querySelectorAll("img").length === 0) continue;
        if (topic.querySelectorAll("img").length != 3) continue;
        if (topic.querySelectorAll("img")[2].alt !== "peliscr.jpg") {
          topic.style.display = "none";
          continue;
        }
        var link = topic.querySelector("a").href;
        var response = yield common__WEBPACK_IMPORTED_MODULE_1__["default"].http.fetchAndParseHtml(link);
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(response);
        var request = {
          torrents: [],
          dom: topic,
          imdbId,
          query: ""
        };
        requests.push(request);
      }
      return requests;
    })();
  }
  name() {
    return "CLAN-SUD";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      return false;
    })();
  }
  insertTrackersSelect(select) {
    common__WEBPACK_IMPORTED_MODULE_1__["default"].dom.insertBefore(select, document.querySelector('div[data-tableid="topics"]'));
  }
}

/***/ }),

/***/ "./src/trackers/CinemaZ.ts":
/*!*********************************!*\
  !*** ./src/trackers/CinemaZ.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CinemaZ)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var _document$querySelect;
      var requests = [];
      (_document$querySelect = document.querySelectorAll("#content-area > div.block > .row")) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.forEach(element => {
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element);
        var request = {
          torrents: [],
          dom: element,
          imdbId,
          query: ""
        };
        requests.push(request);
      });
      return requests;
    })();
  }
  name() {
    return "CinemaZ";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      var _result$textContent;
      if (!request.imdbId) return true;
      var queryUrl = "https://cinemaz.to/movies?search=&imdb=" + request.imdbId;
      var result = yield common__WEBPACK_IMPORTED_MODULE_1__["default"].http.fetchAndParseHtml(queryUrl);
      return (_result$textContent = result.textContent) === null || _result$textContent === void 0 ? void 0 : _result$textContent.includes("No Movie found!");
    })();
  }
  insertTrackersSelect(select) {
    common__WEBPACK_IMPORTED_MODULE_1__["default"].dom.addChild(document.querySelector("#content-area > div.well.well-sm"), select);
  }
}

/***/ }),

/***/ "./src/trackers/FL.ts":
/*!****************************!*\
  !*** ./src/trackers/FL.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FL)
/* harmony export */ });
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/dom */ "./src/utils/dom.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var requests = [];
      var nodes = document.querySelectorAll(".torrentrow");
      (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.updateTotalCount)(nodes.length);
      var i = 1;
      for (var element of nodes) {
        var _element$querySelecto;
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.updateCount)(i++);
        var link = element.querySelector('a[href*="details.php?id"]');
        if (!link) {
          continue;
        }
        var response = yield common__WEBPACK_IMPORTED_MODULE_2__["default"].http.fetchAndParseHtml(link.href);
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseImdbIdFromLink)(response);
        var size = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseSize)((_element$querySelecto = element.querySelector(".torrenttable:nth-child(7)")) === null || _element$querySelecto === void 0 ? void 0 : _element$querySelecto.textContent);
        var request = {
          torrents: [{
            size,
            tags: [],
            dom: element
          }],
          dom: element,
          imdbId,
          query: ""
        };
        requests.push(request);
      }
      return requests;
    })();
  }
  name() {
    return "FL";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      if (!request.imdbId) return true;
      var queryUrl = "https://filelist.io/browse.php?search=" + request.imdbId + "&cat=0&searchin=1&sort=3";
      var result = yield common__WEBPACK_IMPORTED_MODULE_2__["default"].http.fetchAndParseHtml(queryUrl);
      return result.querySelectorAll(".torrentrow").length === 0;
    })();
  }
  insertTrackersSelect(select) {
    common__WEBPACK_IMPORTED_MODULE_2__["default"].dom.addChild(document.querySelector("form p"), select);
  }
}

/***/ }),

/***/ "./src/trackers/GPW.ts":
/*!*****************************!*\
  !*** ./src/trackers/GPW.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GPW)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var requests = [];
      document.querySelectorAll("#torrent_table tr.TableTorrent-rowMovieInfo").forEach(element => {
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element);
        var groupId = element.getAttribute("group-id");
        var torrents = [];
        if (groupId) {
          var torrentElements = document.querySelectorAll("tr.TableTorrent-rowTitle[group-id=\"".concat(groupId, "\"]"));
          for (var torrentElement of torrentElements) {
            var torrentTtitle = torrentElement.querySelector("span.TorrentTitle").textContent;
            var tags = [];
            if (torrentTtitle.includes("Remux")) {
              tags.push("Remux");
            }
            var container = undefined;
            var containerElement = torrentElement.querySelector("span.TorrentTitle-item.codec");
            if (containerElement) {
              container = containerElement.textContent.trim();
            }
            var torrent = {
              container,
              dom: torrentElement,
              format: "",
              resolution: torrentElement.querySelector("span.TorrentTitle-item.resolution").textContent.trim(),
              size: (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(torrentElement.querySelector("td.TableTorrent-cellStatSize").textContent),
              tags
            };
            torrents.push(torrent);
          }
        }
        var request = {
          torrents,
          dom: element,
          imdbId,
          query: ""
        };
        requests.push(request);
      });
      return requests;
    })();
  }
  name() {
    return "GPW";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      if (!request.imdbId) return true;
      var queryUrl = "https://greatposterwall.com/torrents.php?groupname=".concat(request.imdbId);
      var result = yield common__WEBPACK_IMPORTED_MODULE_1__["default"].http.fetchAndParseHtml(queryUrl);
      return result.querySelector(".torrent-listings-no-result") !== null;
    })();
  }
  insertTrackersSelect(select) {
    select.classList.add('Input');
    common__WEBPACK_IMPORTED_MODULE_1__["default"].dom.addChild(document.querySelector(".SearchPageFooter-actions"), select);
  }
}

/***/ }),

/***/ "./src/trackers/HDB.ts":
/*!*****************************!*\
  !*** ./src/trackers/HDB.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HDB)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var _document$querySelect;
      var requests = [];
      (_document$querySelect = document.querySelectorAll("#torrent-list > tbody tr")) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.forEach(element => {
        var _element$querySelecto;
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element);
        var size = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)((_element$querySelecto = element.querySelector("td:nth-child(6)")) === null || _element$querySelecto === void 0 ? void 0 : _element$querySelecto.textContent);
        var request = {
          torrents: [{
            size,
            tags: [],
            dom: element
          }],
          dom: element,
          imdbId,
          query: ""
        };
        requests.push(request);
      });
      return requests;
    })();
  }
  name() {
    return "HDB";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      if (!request.imdbId) return true;
      var queryUrl = "https://hdbits.org/browse.php?c3=1&c1=1&c2=1&tagsearchtype=or&imdb=" + request.imdbId + "&sort=size&h=8&d=DESC";
      var result = yield common__WEBPACK_IMPORTED_MODULE_1__["default"].http.fetchAndParseHtml(queryUrl);
      return result.querySelector("#resultsarea").textContent.includes("Nothing here!");
    })();
  }
  insertTrackersSelect(select) {
    document.querySelector("#moresearch3 > td:nth-child(2)").innerHTML += "<br><br>Find unique for:<br>";
    common__WEBPACK_IMPORTED_MODULE_1__["default"].dom.addChild(document.querySelector("#moresearch3 > td:nth-child(2)"), select);
  }
}

/***/ }),

/***/ "./src/trackers/HDSky.ts":
/*!*******************************!*\
  !*** ./src/trackers/HDSky.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HDSky)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var requests = [];
      for (var element of document.querySelectorAll('.torrents')[0].children[0].children) {
        var _element$children$;
        if (!element.querySelector(".torrentname")) {
          continue;
        }
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element.querySelector(".torrentname"));
        var size = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)((_element$children$ = element.children[6]) === null || _element$children$ === void 0 ? void 0 : _element$children$.textContent);
        var request = {
          torrents: [{
            size,
            tags: [],
            dom: element
          }],
          dom: element,
          imdbId,
          query: ""
        };
        requests.push(request);
      }
      return requests;
    })();
  }
  name() {
    return "HDSky";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      return false;
    })();
  }
  insertTrackersSelect(select) {
    var element = document.querySelector(".searchbox").children[2].querySelector("td td.rowfollow tr");
    common__WEBPACK_IMPORTED_MODULE_1__["default"].dom.addChild(element, select);
  }
}

/***/ }),

/***/ "./src/trackers/HDT.ts":
/*!*****************************!*\
  !*** ./src/trackers/HDT.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HDT)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var _document$querySelect;
      var requests = [];
      (_document$querySelect = document.querySelectorAll('table.mainblockcontenttt tr a[href^="details.php?id="]')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.forEach(element => {
        var _line$children$;
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element.closest("td"));
        var line = element.closest("tr");
        var size = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)((_line$children$ = line.children[7]) === null || _line$children$ === void 0 ? void 0 : _line$children$.textContent);
        var request = {
          torrents: [{
            size,
            tags: [],
            dom: element
          }],
          dom: line,
          imdbId,
          query: ""
        };
        requests.push(request);
      });
      return requests;
    })();
  }
  name() {
    return "HDT";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      return false;
    })();
  }
  insertTrackersSelect(select) {
    var element = document.querySelectorAll(".mainblockcontentsearch tr")[2];
    common__WEBPACK_IMPORTED_MODULE_1__["default"].dom.addChild(element, select);
  }
}

/***/ }),

/***/ "./src/trackers/IPT.ts":
/*!*****************************!*\
  !*** ./src/trackers/IPT.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CG)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var _document$querySelect;
      var requests = [];
      (_document$querySelect = document.querySelectorAll(".mBox table")) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.forEach(element => {
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element);
        var request = {
          torrents: [],
          dom: element.parentElement,
          imdbId,
          query: ""
        };
        requests.push(request);
      });
      return requests;
    })();
  }
  name() {
    return "HDT";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      return false;
    })();
  }
  insertTrackersSelect(select) {
    var element = document.createElement("p");
    common__WEBPACK_IMPORTED_MODULE_1__["default"].dom.addChild(element, select);
    common__WEBPACK_IMPORTED_MODULE_1__["default"].dom.insertAfter(element, document.querySelector('.mBox form input[name="q"]').closest("p"));
  }
}

/***/ }),

/***/ "./src/trackers/JPTV.ts":
/*!******************************!*\
  !*** ./src/trackers/JPTV.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ JPTV)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var requests = [];
      var nodes = document.querySelectorAll(".view-torrent");
      for (var element of nodes) {
        var response = yield common__WEBPACK_IMPORTED_MODULE_1__["default"].http.fetchAndParseHtml(element.href);
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(response);
        var size = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(document.querySelector(".view-torrent").parentElement.parentElement.children[7].textContent.trim());
        var request = {
          torrents: [{
            size,
            tags: [],
            dom: element
          }],
          dom: element,
          imdbId,
          query: ""
        };
        requests.push(request);
      }
      return requests;
    })();
  }
  name() {
    return "JPTV";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      return false;
    })();
  }
  insertTrackersSelect(select) {
    common__WEBPACK_IMPORTED_MODULE_1__["default"].dom.addChild(document.querySelector(".form-torrent-search"), select);
  }
}

/***/ }),

/***/ "./src/trackers/KG.ts":
/*!****************************!*\
  !*** ./src/trackers/KG.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ KG)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tracker */ "./src/trackers/tracker.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



var parseCategory = element => {
  var category = _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.MOVIE;
  var img = element.querySelectorAll("td img")[0];
  var imageSrc = img.attributes["src"].value;
  if (imageSrc.includes("40.jpg")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.AUDIOBOOK;
  if (imageSrc.includes("41.jpg")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.BOOK;
  if (img.attributes["title"].value.includes("Music")) return _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.MUSIC;
  return category;
};
var parseTorrent = element => {
  var _element$querySelecto, _element$querySelecto2;
  var torrents = [];
  var size = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)((_element$querySelecto = element.querySelector("td:nth-child(11)")) === null || _element$querySelecto === void 0 ? void 0 : (_element$querySelecto2 = _element$querySelecto.textContent) === null || _element$querySelecto2 === void 0 ? void 0 : _element$querySelecto2.replace(",", ""));
  var resolution = "SD";
  var format = undefined;
  if (element.querySelector('td img[src*="hdrip1080.png"]')) {
    resolution = "1080p";
  } else if (element.querySelector('td img[src*="hdrip720.png"]')) {
    resolution = "720p";
  } else if (element.querySelector('td img[src*="dvdr.png"]')) {
    format = "VOB IFO";
  } else if (element.querySelector('td img[src*="bluray.png"]')) {
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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var requests = [];
      document.querySelectorAll("#browse > tbody tr").forEach(element => {
        var linksContainer = element.querySelector("td:nth-child(2) > div > span:nth-child(1)");
        if (linksContainer === null) return;
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(linksContainer);
        var torrents = parseTorrent(element);
        var request = {
          torrents,
          dom: element,
          imdbId,
          query: "",
          category: parseCategory(element)
        };
        requests.push(request);
      });
      return requests;
    })();
  }
  name() {
    return "KG";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      if (!request.imdbId) return true;
      var queryUrl = "https://karagarga.in/browse.php?sort=size&search=" + request.imdbId + "&search_type=imdb&d=DESC";
      var result = yield common__WEBPACK_IMPORTED_MODULE_2__["default"].http.fetchAndParseHtml(queryUrl);
      return result.querySelector("tr.oddrow") === null;
    })();
  }
  insertTrackersSelect(select) {
    common__WEBPACK_IMPORTED_MODULE_2__["default"].dom.insertBefore(select, document.getElementById("showdead"));
  }
}

/***/ }),

/***/ "./src/trackers/MTeam.ts":
/*!*******************************!*\
  !*** ./src/trackers/MTeam.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MTeam)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var requests = [];
      for (var element of document.querySelectorAll('.torrents')[0].children[0].children) {
        var _element$children$;
        if (!element.querySelector(".torrentname")) {
          continue;
        }
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element.querySelector(".torrentname"));
        var size = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)((_element$children$ = element.children[6]) === null || _element$children$ === void 0 ? void 0 : _element$children$.textContent);
        var request = {
          torrents: [{
            size,
            tags: [],
            dom: element
          }],
          dom: element,
          imdbId,
          query: ""
        };
        requests.push(request);
      }
      return requests;
    })();
  }
  name() {
    return "M-Team";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      return false;
    })();
  }
  insertTrackersSelect(select) {
    var element = document.querySelector(".searchbox").children[2].querySelector("td td.rowfollow tr");
    common__WEBPACK_IMPORTED_MODULE_1__["default"].dom.addChild(element, select);
  }
}

/***/ }),

/***/ "./src/trackers/NewInsane.ts":
/*!***********************************!*\
  !*** ./src/trackers/NewInsane.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NewInsane)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var requests = [];
      document.querySelectorAll("table.torrenttable tr.torrentrow").forEach(element => {
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element);
        var request = {
          torrents: [],
          dom: element,
          imdbId,
          query: ""
        };
        requests.push(request);
      });
      return requests;
    })();
  }
  name() {
    return "NewInsane";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      return !request.imdbId;
    })();
  }
  insertTrackersSelect(select) {
    common__WEBPACK_IMPORTED_MODULE_1__["default"].dom.addChild(document.querySelector(".searchbuttons.actiontitle"), select);
  }
}

/***/ }),

/***/ "./src/trackers/PTP.ts":
/*!*****************************!*\
  !*** ./src/trackers/PTP.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PTP)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tracker */ "./src/trackers/tracker.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      return [];
    })();
  }
  name() {
    return "PTP";
  }
  canUpload(request, onlyNew) {
    return _asyncToGenerator(function* () {
      if (request.category != undefined && request.category !== _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.MOVIE) return false;
      if (!request.imdbId) return true;
      var query_url = "https://passthepopcorn.me/torrents.php?imdb=" + request.imdbId;
      var result = yield common__WEBPACK_IMPORTED_MODULE_2__["default"].http.fetchAndParseHtml(query_url);
      var notFound = result.querySelector("#no_results_message") !== null;
      if (notFound) {
        return true;
      }
      if (onlyNew) {
        return false;
      }
      var torrents = parseAvailableTorrents(result);
      for (var torrent of request.torrents) {
        if (canUploadTorrent(torrent, torrents)) {
          torrent.dom.style.border = "2px solid red";
          notFound = true;
        } else {
          torrent.dom.style.display = "none";
        }
      }
      return notFound;
    })();
  }
  insertTrackersSelect(select) {
    var element = document.querySelector(".search-form__footer__buttons");
    if (!element) return;
    common__WEBPACK_IMPORTED_MODULE_2__["default"].dom.insertBefore(select, element);
  }
}
var parseAvailableTorrents = result => {
  var torrents = [];
  result.querySelectorAll('#torrent-table tr[id^="group_torrent_header_"]').forEach(line => {
    var data = line.children[0].textContent.trim().split("/");
    var size = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(line.children[1].textContent.trim());
    var tags = [];
    if (line.textContent.includes("Remux")) {
      tags.push("Remux");
    }
    var torrent = {
      container: data[0].split("]")[1].trim(),
      format: data[1].trim(),
      resolution: data[3].trim(),
      tags: tags,
      size,
      dom: line
    };
    torrents.push(torrent);
  });
  return torrents;
};
function sameContainer(first, second) {
  return first === second || first === "H.264" && second === "x264" || first === "x264" && second === "H.264" || first === "H.265" && second === "x265" || first === "x265" && second === "H.265" || first === "UHD100" && second === "BD100" || first === "BD100" && second === "UHD100" || first === "UHD66" && second === "BD66" || first === "BD66" && second === "UHD66";
}
function isSD(resolution) {
  var sdResolutions = ["SD", "PAL", "NTSC"];
  if (sdResolutions.indexOf(resolution.toUpperCase())) return true;
  var height = resolution.replace("p", "");
  if (resolution.includes("x")) {
    height = resolution.split("x")[1];
  }
  if (parseInt(height) && parseInt(height) < 720) return true;
}
function sameResolution(first, second) {
  if (!first.resolution || !second.resolution) return true;
  if (first.resolution === second.resolution) return true;
  if (first.resolution === "SD") return isSD(second.resolution);
  if (second.resolution === "SD") return isSD(first.resolution);
}
var canUploadTorrent = (torrent, availableTorrents) => {
  var similarTorrents = availableTorrents.filter(e => {
    return sameResolution(torrent, e) && (torrent.container === undefined || sameContainer(e.container, torrent.container)) && (!torrent.tags.includes("Remux") || e.tags.includes("Remux"));
  });
  if (similarTorrents.length == 0 && torrent.resolution && torrent.container) {
    return true;
  }
  if (similarTorrents.length == 1) {
    if (torrent.size > similarTorrents[0].size * 1.5 || similarTorrents[0].size > torrent.size * 1.5) {
      return true;
    }
  }
  return false;
};

/***/ }),

/***/ "./src/trackers/SC.ts":
/*!****************************!*\
  !*** ./src/trackers/SC.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SC)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _tracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tracker */ "./src/trackers/tracker.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function parseTorrent(element) {
  var infos = element.querySelector(".torrent_info .activity_info").querySelectorAll("div");
  var size = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(infos[1].textContent);
  var resolution = infos[0].textContent.trim();
  if (resolution == "CD" || resolution == "WEB") {
    resolution = undefined;
  }
  var format = undefined;
  if (resolution === "DVD-R") {
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
  var category = _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.MOVIE;
  var infos = element.querySelector(".torrent_info .activity_info").querySelectorAll("div");
  var info = infos[0].textContent;
  if (info == "CD" || info === "WEB") {
    category = _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.MUSIC;
  } else if ((0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(infos[0].textContent)) {
    category = _tracker__WEBPACK_IMPORTED_MODULE_1__.Category.BOOK;
  }
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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var requests = [];
      document.querySelectorAll(".torrent_card").forEach(element => {
        var dom = element;
        var links_container = element.querySelector(".torrent_tags");
        if (links_container === null) return;
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(links_container);
        var request = {
          torrents: [parseTorrent(element)],
          dom: dom,
          imdbId,
          query: "",
          category: parseCategory(element)
        };
        requests.push(request);
      });
      return requests;
    })();
  }
  name() {
    return "SC";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      if (!request.imdbId) return true;
      var queryUrl = "https://secret-cinema.pw/torrents.php?action=advanced&searchsubmit=1&filter_cat=1&cataloguenumber=".concat(request.imdbId, "&order_by=time&order_way=desc&tags_type=0");
      var result = yield common__WEBPACK_IMPORTED_MODULE_2__["default"].http.fetchAndParseHtml(queryUrl);
      return result.querySelector(".torrent_card_container") === null;
    })();
  }
  insertTrackersSelect(select) {
    common__WEBPACK_IMPORTED_MODULE_2__["default"].dom.addChild(document.querySelector("#ft_container p"), select);
  }
}

/***/ }),

/***/ "./src/trackers/TL.ts":
/*!****************************!*\
  !*** ./src/trackers/TL.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TL)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var _document$querySelect;
      var requests = [];
      (_document$querySelect = document.querySelectorAll(".torrent")) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.forEach(element => {
        var _element$querySelecto;
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element);
        var size = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)((_element$querySelecto = element.querySelector(".td-size")) === null || _element$querySelecto === void 0 ? void 0 : _element$querySelecto.textContent);
        var request = {
          torrents: [{
            size,
            tags: [],
            dom: element
          }],
          dom: element,
          imdbId,
          query: ""
        };
        requests.push(request);
      });
      return requests;
    })();
  }
  name() {
    return "TL";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      return false;
    })();
  }
  insertTrackersSelect(select) {
    select.style.margin = "20px 0";
    select.style.padding = "2px 2px 3px 2px";
    select.style.color = "#111";
    common__WEBPACK_IMPORTED_MODULE_1__["default"].dom.addChild(document.querySelector(".sub-navbar"), select);
  }
}

/***/ }),

/***/ "./src/trackers/TiK.ts":
/*!*****************************!*\
  !*** ./src/trackers/TiK.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TiK)
/* harmony export */ });
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/dom */ "./src/utils/dom.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



var findTorrentsTable = () => {
  var tables = document.querySelectorAll('table');
  for (var table of tables) {
    var firstRow = table.querySelector('tr');
    var cells = firstRow.querySelectorAll('td');
    if (cells[0] && cells[0].innerText === 'Type' && cells[1] && cells[1].innerText === 'Name' && cells[2] && cells[3].innerText === 'Director') {
      return table;
    }
  }
  console.log("No torrents table found.");
  return undefined;
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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var requests = [];
      var torrentsTable = findTorrentsTable();
      if (!torrentsTable) {
        return requests;
      }
      var nodes = torrentsTable.querySelectorAll("tr");
      (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.updateTotalCount)(nodes.length - 1);
      var i = 1;
      for (var _i = 1; _i < nodes.length; _i++) {
        var element = nodes[_i];
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.updateCount)(_i);
        var link = element.querySelector('a[href*="details.php?id"]');
        if (!link) {
          continue;
        }
        var response = yield common__WEBPACK_IMPORTED_MODULE_2__["default"].http.fetchAndParseHtml(link.href);
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseImdbIdFromLink)(response);
        var size = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseSize)(element.children[6].textContent);
        var request = {
          torrents: [{
            size,
            tags: [],
            dom: element
          }],
          dom: element,
          imdbId,
          query: ""
        };
        requests.push(request);
      }
      return requests;
    })();
  }
  name() {
    return "TiK";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      return false;
    })();
  }
  insertTrackersSelect(select) {
    var stateSelect = document.getElementById("incldead");
    var td = document.createElement("td");
    td.appendChild(select);
    common__WEBPACK_IMPORTED_MODULE_2__["default"].dom.insertBefore(td, stateSelect.parentElement);
  }
}

/***/ }),

/***/ "./src/trackers/index.ts":
/*!*******************************!*\
  !*** ./src/trackers/index.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Aither": () => (/* reexport safe */ _Aither__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "AvistaZ": () => (/* reexport safe */ _AvistaZ__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "BHD": () => (/* reexport safe */ _BHD__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "BLU": () => (/* reexport safe */ _BLU__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "BTarg": () => (/* reexport safe */ _BTarg__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "CG": () => (/* reexport safe */ _CG__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   "CHD": () => (/* reexport safe */ _CHD__WEBPACK_IMPORTED_MODULE_22__["default"]),
/* harmony export */   "CLANSUD": () => (/* reexport safe */ _CLAN_SUD__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   "CinemaZ": () => (/* reexport safe */ _CinemaZ__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   "FL": () => (/* reexport safe */ _FL__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   "GPW": () => (/* reexport safe */ _GPW__WEBPACK_IMPORTED_MODULE_9__["default"]),
/* harmony export */   "HDB": () => (/* reexport safe */ _HDB__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   "HDSky": () => (/* reexport safe */ _HDSky__WEBPACK_IMPORTED_MODULE_23__["default"]),
/* harmony export */   "HDT": () => (/* reexport safe */ _HDT__WEBPACK_IMPORTED_MODULE_11__["default"]),
/* harmony export */   "IPT": () => (/* reexport safe */ _IPT__WEBPACK_IMPORTED_MODULE_12__["default"]),
/* harmony export */   "JPTV": () => (/* reexport safe */ _JPTV__WEBPACK_IMPORTED_MODULE_13__["default"]),
/* harmony export */   "KG": () => (/* reexport safe */ _KG__WEBPACK_IMPORTED_MODULE_14__["default"]),
/* harmony export */   "MTeam": () => (/* reexport safe */ _MTeam__WEBPACK_IMPORTED_MODULE_20__["default"]),
/* harmony export */   "NewInsane": () => (/* reexport safe */ _NewInsane__WEBPACK_IMPORTED_MODULE_15__["default"]),
/* harmony export */   "PTP": () => (/* reexport safe */ _PTP__WEBPACK_IMPORTED_MODULE_16__["default"]),
/* harmony export */   "SC": () => (/* reexport safe */ _SC__WEBPACK_IMPORTED_MODULE_17__["default"]),
/* harmony export */   "TL": () => (/* reexport safe */ _TL__WEBPACK_IMPORTED_MODULE_19__["default"]),
/* harmony export */   "TiK": () => (/* reexport safe */ _TiK__WEBPACK_IMPORTED_MODULE_18__["default"]),
/* harmony export */   "nCore": () => (/* reexport safe */ _nCore__WEBPACK_IMPORTED_MODULE_21__["default"])
/* harmony export */ });
/* harmony import */ var _Aither__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Aither */ "./src/trackers/Aither.ts");
/* harmony import */ var _AvistaZ__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AvistaZ */ "./src/trackers/AvistaZ.ts");
/* harmony import */ var _BHD__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BHD */ "./src/trackers/BHD.ts");
/* harmony import */ var _BLU__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BLU */ "./src/trackers/BLU.ts");
/* harmony import */ var _BTarg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./BTarg */ "./src/trackers/BTarg.ts");
/* harmony import */ var _CG__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CG */ "./src/trackers/CG.ts");
/* harmony import */ var _CLAN_SUD__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./CLAN-SUD */ "./src/trackers/CLAN-SUD.ts");
/* harmony import */ var _CinemaZ__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./CinemaZ */ "./src/trackers/CinemaZ.ts");
/* harmony import */ var _FL__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./FL */ "./src/trackers/FL.ts");
/* harmony import */ var _GPW__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./GPW */ "./src/trackers/GPW.ts");
/* harmony import */ var _HDB__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./HDB */ "./src/trackers/HDB.ts");
/* harmony import */ var _HDT__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./HDT */ "./src/trackers/HDT.ts");
/* harmony import */ var _IPT__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./IPT */ "./src/trackers/IPT.ts");
/* harmony import */ var _JPTV__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./JPTV */ "./src/trackers/JPTV.ts");
/* harmony import */ var _KG__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./KG */ "./src/trackers/KG.ts");
/* harmony import */ var _NewInsane__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./NewInsane */ "./src/trackers/NewInsane.ts");
/* harmony import */ var _PTP__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./PTP */ "./src/trackers/PTP.ts");
/* harmony import */ var _SC__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./SC */ "./src/trackers/SC.ts");
/* harmony import */ var _TiK__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./TiK */ "./src/trackers/TiK.ts");
/* harmony import */ var _TL__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./TL */ "./src/trackers/TL.ts");
/* harmony import */ var _MTeam__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./MTeam */ "./src/trackers/MTeam.ts");
/* harmony import */ var _nCore__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./nCore */ "./src/trackers/nCore.ts");
/* harmony import */ var _CHD__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./CHD */ "./src/trackers/CHD.ts");
/* harmony import */ var _HDSky__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./HDSky */ "./src/trackers/HDSky.ts");


























/***/ }),

/***/ "./src/trackers/nCore.ts":
/*!*******************************!*\
  !*** ./src/trackers/nCore.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MTeam)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


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
  getSearchRequest() {
    return _asyncToGenerator(function* () {
      var requests = [];
      for (var element of document.querySelectorAll(".box_torrent")) {
        var imdbId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseImdbIdFromLink)(element);
        var size = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.parseSize)(element.children[1].children[4].textContent);
        var request = {
          torrents: [{
            size,
            tags: [],
            dom: element
          }],
          dom: element,
          imdbId,
          query: ""
        };
        requests.push(request);
      }
      return requests;
    })();
  }
  name() {
    return "nCore";
  }
  canUpload(request) {
    return _asyncToGenerator(function* () {
      return false;
    })();
  }
  insertTrackersSelect(select) {
    var element = document.querySelector("#keresoresz tr");
    common__WEBPACK_IMPORTED_MODULE_1__["default"].dom.addChild(element, select);
  }
}

/***/ }),

/***/ "./src/trackers/tracker.ts":
/*!*********************************!*\
  !*** ./src/trackers/tracker.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Category": () => (/* binding */ Category)
/* harmony export */ });
var Category = /*#__PURE__*/function (Category) {
  Category[Category["TV"] = 0] = "TV";
  Category[Category["MOVIE"] = 1] = "MOVIE";
  Category[Category["MUSIC"] = 2] = "MUSIC";
  Category[Category["BOOK"] = 3] = "BOOK";
  Category[Category["AUDIOBOOK"] = 4] = "AUDIOBOOK";
  return Category;
}({});

/***/ }),

/***/ "./src/utils/cache.ts":
/*!****************************!*\
  !*** ./src/utils/cache.ts ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addToCache": () => (/* binding */ addToCache),
/* harmony export */   "existsInCache": () => (/* binding */ existsInCache)
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var cache = await GM.getValue("cache", {});
var existsInCache = (tracker, key) => {
  if (cache[tracker]) {
    return cache[tracker].indexOf(key) > -1;
  }
  return false;
};
var addToCache = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (tracker, imdb_id) {
    var tracker_cache = cache[tracker];
    if (!tracker_cache) {
      tracker_cache = [];
    }
    tracker_cache.push(imdb_id);
    cache[tracker] = tracker_cache;
    yield GM.setValue("cache", cache);
  });
  return function addToCache(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "./src/utils/dom.ts":
/*!**************************!*\
  !*** ./src/utils/dom.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addCounter": () => (/* binding */ addCounter),
/* harmony export */   "createTrackersSelect": () => (/* binding */ createTrackersSelect),
/* harmony export */   "hideMessageBox": () => (/* binding */ hideMessageBox),
/* harmony export */   "showWaitingMessage": () => (/* binding */ showWaitingMessage),
/* harmony export */   "updateCount": () => (/* binding */ updateCount),
/* harmony export */   "updateNewContent": () => (/* binding */ updateNewContent),
/* harmony export */   "updateTotalCount": () => (/* binding */ updateTotalCount)
/* harmony export */ });
var createTrackersSelect = trackers => {
  var select_dom = document.createElement("select");
  select_dom.id = "tracker-select";
  select_dom.style.margin = "0 5px";
  var opt = document.createElement("option");
  opt.disabled = true;
  opt.selected = true;
  opt.innerHTML = "Select target tracker";
  select_dom.appendChild(opt);
  for (var i = 0; i < trackers.length; i++) {
    var _opt = document.createElement("option");
    _opt.value = trackers[i];
    _opt.innerHTML = trackers[i];
    select_dom.appendChild(_opt);
  }
  return select_dom;
};
var createMessageBox = () => {
  var div = document.getElementById("message-box");
  if (div) return div;
  div = document.createElement("div");
  div.id = "message-box";
  addStyle(div);
  div.addEventListener("click", () => div.style.display = "none");
  document.body.appendChild(div);
  return div;
};
var addCounter = () => {
  var messageBox = createMessageBox();
  messageBox.innerHTML = 'Checked: <span class="checked_count">0</span>/<span class="total_torrents_count">0</span> | New content: <span class="new_content_count">0</span>';
  messageBox.style.display = "block";
};
var addStyle = messageBox => {
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
var showWaitingMessage = () => {
  var messageBox = createMessageBox();
  messageBox.innerHTML = 'Getting search list: <span class="checked_count">0</span>/<span class="total_torrents_count">0</span>';
  messageBox.style.display = "block";
};
var hideMessageBox = () => {
  document.getElementById("message-box").style.display = "none";
};
var updateCount = count => {
  document.querySelector(".checked_count").textContent = String(count);
};
var updateTotalCount = count => {
  document.querySelector(".total_torrents_count").textContent = String(count);
};
var updateNewContent = count => {
  document.querySelector(".new_content_count").textContent = String(count);
};

/***/ }),

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "parseImdbId": () => (/* binding */ parseImdbId),
/* harmony export */   "parseImdbIdFromLink": () => (/* binding */ parseImdbIdFromLink),
/* harmony export */   "parseResolution": () => (/* binding */ parseResolution),
/* harmony export */   "parseSize": () => (/* binding */ parseSize)
/* harmony export */ });
var parseSize = text => {
  var size = null;
  text = text.replace("GiB", "GB").replace("MiB", "MB");
  if (text.includes("GB")) {
    size = parseFloat(text.split("GB")[0]) * 1024; // MB
  } else if (text.includes("MB")) size = parseFloat(text.split("MB")[0]);
  return size;
};
var parseImdbIdFromLink = element => {
  var imdbLink = element.querySelector('[href*="imdb.com/title/tt"]');
  if (imdbLink) {
    return "tt" + imdbLink.href.split("/tt")[1].replace("/", "").trim().replaceAll(/\?.+/g, "");
  }
  return null;
};
var parseImdbId = text => {
  var results = text.match(/(tt\d+)/);
  if (!results) {
    return null;
  }
  return results[0];
};
var parseResolution = text => {
  var resolutions = ["720p", "1080p", "2160p"];
  if (!text) return null;
  for (var resolution of resolutions) {
    if (text.includes(resolution)) return resolution;
  }
  return null;
};

/***/ }),

/***/ "../common/dist/index.mjs":
/*!********************************!*\
  !*** ../common/dist/index.mjs ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ tracker_tools)
/* harmony export */ });
/* harmony import */ var _trim21_gm_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @trim21/gm-fetch */ "../node_modules/@trim21/gm-fetch/dist/index.mjs");


const parser = new DOMParser();
const fetchUrl = async (url, wait = 1000) => {
    await sleep(wait);
    const res = await (0,_trim21_gm_fetch__WEBPACK_IMPORTED_MODULE_0__["default"])(url);
    return await res.text();
};
const fetchAndParseHtml = async (query_url) => {
    const response = await fetchUrl(query_url);
    return parser.parseFromString(response, "text/html").body;
};
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

var http = /*#__PURE__*/Object.freeze({
    __proto__: null,
    fetchAndParseHtml: fetchAndParseHtml,
    fetchUrl: fetchUrl
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
    const div = document.createElement('div');
    div.innerHTML = '<span style="margin-left:15px;color:white;font-weight:bold;float:right;font-size:22px;line-height:20px;cursor:pointer;transition:0.3s;\n" onclick="this.parentElement.style.display=\'none\';">&times;</span>' +
        '<span id="message"></span>';
    div.style.position = 'fixed';
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
const showError = (message) => {
    const element = document.querySelector('#message');
    element.innerHTML = "Error occurred in Fin Unique titles script: " + message;
    element.parentElement.style.display = "block";
};

var dom = /*#__PURE__*/Object.freeze({
    __proto__: null,
    addChild: addChild,
    appendErrorMessage: appendErrorMessage,
    insertAfter: insertAfter,
    insertBefore: insertBefore,
    showError: showError
});

const tracker_tools = {
    http,
    dom
};


//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "../node_modules/@trim21/gm-fetch/dist/index.mjs":
/*!*******************************************************!*\
  !*** ../node_modules/@trim21/gm-fetch/dist/index.mjs ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GM_fetch)
/* harmony export */ });
function parseRawHeaders(h) {
    const s = h.trim();
    if (!s) {
        return new Headers();
    }
    const array = s.split("\r\n").map((value) => {
        let s = value.split(":");
        return [s[0].trim(), s[1].trim()];
    });
    return new Headers(array);
}
function parseGMResponse(req, res) {
    return new ResImpl(res.response, {
        statusCode: res.status,
        statusText: res.statusText,
        headers: parseRawHeaders(res.responseHeaders),
        finalUrl: res.finalUrl,
        redirected: res.finalUrl === req.url,
    });
}
class ResImpl {
    constructor(body, init) {
        this.rawBody = body;
        this.init = init;
        this.body = toReadableStream(body);
        const { headers, statusCode, statusText, finalUrl, redirected } = init;
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
        if (this.bodyUsed) {
            throw new TypeError("Failed to execute 'arrayBuffer' on 'Response': body stream already read");
        }
        this._bodyUsed = true;
        return this.rawBody.arrayBuffer();
    }
    blob() {
        if (this.bodyUsed) {
            throw new TypeError("Failed to execute 'blob' on 'Response': body stream already read");
        }
        this._bodyUsed = true;
        return Promise.resolve(this.rawBody.slice(0, this.rawBody.length, this.rawBody.type));
    }
    clone() {
        if (this.bodyUsed) {
            throw new TypeError("Failed to execute 'clone' on 'Response': body stream already read");
        }
        return new ResImpl(this.rawBody, this.init);
    }
    formData() {
        if (this.bodyUsed) {
            throw new TypeError("Failed to execute 'formData' on 'Response': body stream already read");
        }
        this._bodyUsed = true;
        return this.rawBody.text().then(decode);
    }
    async json() {
        if (this.bodyUsed) {
            throw new TypeError("Failed to execute 'json' on 'Response': body stream already read");
        }
        this._bodyUsed = true;
        return JSON.parse(await this.rawBody.text());
    }
    text() {
        if (this.bodyUsed) {
            throw new TypeError("Failed to execute 'text' on 'Response': body stream already read");
        }
        this._bodyUsed = true;
        return this.rawBody.text();
    }
}
function decode(body) {
    const form = new FormData();
    body
        .trim()
        .split("&")
        .forEach(function (bytes) {
        if (bytes) {
            const split = bytes.split("=");
            const name = split.shift()?.replace(/\+/g, " ");
            const value = split.join("=").replace(/\+/g, " ");
            form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
    });
    return form;
}
function toReadableStream(value) {
    return new ReadableStream({
        start(controller) {
            controller.enqueue(value);
            controller.close();
        },
    });
}

async function GM_fetch(input, init) {
    const request = new Request(input, init);
    let data;
    if (init?.body) {
        data = await request.text();
    }
    return await XHR(request, init, data);
}
function XHR(request, init, data) {
    return new Promise((resolve, reject) => {
        if (request.signal && request.signal.aborted) {
            return reject(new DOMException("Aborted", "AbortError"));
        }
        GM.xmlHttpRequest({
            url: request.url,
            method: gmXHRMethod(request.method.toUpperCase()),
            headers: Object.fromEntries(new Headers(init?.headers).entries()),
            data: data,
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
            },
        });
    });
}
const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "TRACE", "OPTIONS", "CONNECT"];
// a ts type helper to narrow type
function includes(array, element) {
    return array.includes(element);
}
function gmXHRMethod(method) {
    if (includes(httpMethods, method)) {
        return method;
    }
    throw new Error(`unsupported http method ${method}`);
}


//# sourceMappingURL=index.mjs.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && !queue.d) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = 1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;