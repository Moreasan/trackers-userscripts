// ==UserScript==
// @name PurchasableChecker
// @description Checks Requests pages searching purchasable field
// @version 0.0.1
// @author passthepopcorn_cc
// @include https://passthepopcorn.me/requests.php*
// @grant GM.xmlHttpRequest
// @grant GM.setValue
// @grant GM.getValue
// @namespace http://tampermonkey.net/
// @require https://cdn.jsdelivr.net/npm/jquery@^3.6.4/dist/jquery.min.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! common */ "../common/dist/index.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

console.log('PurchasableChecker loaded');
var extractDomain = url => {
  var domain = new URL(url);
  return domain.hostname;
};
var getPurchasableLink = html => {
  var tds = html.querySelectorAll('#request-table td');
  for (var i = 0; i < tds.length; i++) {
    if (tds[i].textContent.includes('Purchasable at')) {
      return tds[i + 1].querySelector('a').href;
    }
  }
  return null;
};
function removeRequest(requestLink) {
  requestLink.parentElement.parentElement.remove();
}
var matches = (domainsList, domain) => {
  for (var wantedDomain of domainsList) {
    if (wantedDomain.includes(domain) || domain.includes(wantedDomain)) {
      return true;
    }
  }
  return false;
};
var checkRequests = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (domainsList) {
    var requestLinks = $('a[class="l_movie"]');
    for (var i = 0; i < requestLinks.length; i++) {
      var requestLink = requestLinks[i];
      if (requestLink.parentElement.innerText.includes('Purchasable')) {
        var result = yield common__WEBPACK_IMPORTED_MODULE_0__["default"].http.fetchAndParseHtml(requestLink.href);
        var purchasableLink = getPurchasableLink(result);
        if (purchasableLink) {
          var domain = extractDomain(purchasableLink);
          if (matches(domainsList, domain)) {
            removeRequest(requestLink);
          }
        } else {
          removeRequest(requestLink);
        }
      } else {
        removeRequest(requestLink);
      }
    }
  });
  return function checkRequests(_x) {
    return _ref.apply(this, arguments);
  };
}();
$(document).ready( /*#__PURE__*/_asyncToGenerator(function* () {
  var path = window.location.pathname;
  var domainsList = [];
  var domains = yield GM.getValue('GMSavedDomains');
  console.log(path);
  // Load saved settings if they exist
  if (domains) {
    domainsList = domains.split(',');
  }

  // Check and run different parts of the script on appropriate pages

  // Main request page
  if (/^\/requests.php(?:\/)?$/.test(path)) {
    console.log('Page match: "slash" "requests" "slash or nothing"');
    var searchForm = $('form[id="request-search-form"]');

    // Input field for users libraries
    $(searchForm).prepend('<tr><td style="padding-bottom:20px;" class="Flabel"><label for="domainOptions">Search string:</label></td>' + '<td class="Ffield"><input style="margin-right: 20px;margin-left: 15px;" id="domainOptions" type="text" value="" name="domainOptions" size="95">' + '<span class="search-form__footer__buttons">' + '<input id="setdomainOptions" value="Set" type="button" role="button"></input></span>' + '<td>' + '<span class="search-form__footer__buttons">' + '<input id="filter-purchasable" value="Filter" type="button" role="button"></input></span>' + '<td>' + '</tr><br>');
    $('#domainOptions').val(domains);
    $('#setdomainOptions').click(function () {
      GM.setValue('GMSavedDomains', $('#domainOptions').val());
    });
    $('#filter-purchasable').click( /*#__PURE__*/_asyncToGenerator(function* () {
      yield checkRequests(domainsList);
    }));
  }
}));
})();

/******/ })()
;