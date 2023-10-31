// ==UserScript==
// @name         PTP - Add IMDB Cover
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       Mea01
// @match        https://passthepopcorn.me/upload.php?*
// @match        https://passthepopcorn.me/upload.php
// @match        https://passthepopcorn.me/requests.php*
// @match        https://passthepopcorn.me/torrents.php*action=editgroup*
// @icon         https://www.google.com/s2/favicons?domain=passthepopcorn.me
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// ==/UserScript==

await (async function () {
  "use strict";

  const isEditPage = () => {
    return location.toString().includes("action=editgroup");
  };
  const addListener = () => {
    if (window.location.href.includes("requests.php")) {
      document.querySelectorAll("#request_form > div").forEach((d) => {
        let labelElement = d.querySelector("label");
        if (labelElement && labelElement.textContent.includes("Image:")) {
          labelElement.style.cursor = "pointer";
          labelElement.addEventListener("click", () => {
            window
              .open(document.querySelector("#image").value, "_blank")
              .focus();
          });
        }
      });
    } else {
      document.querySelectorAll("#upload_table > div").forEach((d) => {
        let labelElement = d.querySelector("label");
        if (labelElement && labelElement.textContent.includes("Cover art")) {
          labelElement.style.cursor = "pointer";
          labelElement.addEventListener("click", () => {
            window
              .open(document.querySelector("#image").value, "_blank")
              .focus();
          });
        }
      });
    }
  };

  const scrapeAndSetCover = (cover_page, thumb_url) => {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url: cover_page,
        method: "GET",
        timeout: 10000,
        onload: function (response) {
          if (response.status === 200) {
            const parser = new DOMParser();
            const result = parser.parseFromString(
              response.responseText,
              "text/html"
            );
            let thumb_search = thumb_url.split("/images/M/")[1].split(".")[0];
            let cover_url;
            result.querySelectorAll("img").forEach((img) => {
              try {
                if (
                  thumb_search === img.src.split("/images/M/")[1].split(".")[0]
                ) {
                  cover_url = img.src;
                }
              } catch (e) {}
            });
            return resolve(cover_url);
          } else {
            return reject();
          }
        },
      });
    });
  };

  const checkImage = (anchor, thumb_url) => {
    let anchor_search = anchor
      .querySelector("img")
      .src.split("/images/M/")[1]
      .split(".")[0];
    let thumb_search = thumb_url.split("/images/M/")[1].split(".")[0];
    return anchor_search === thumb_search;
  };

  const fetchCover = async (imdbId) => {
    let url =
      "https://www.imdb.com/title/" + imdbId + "/mediaindex?refine=poster";

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url: url,
        method: "GET",
        timeout: 10000,
        onload: async function (response) {
          if (response.status === 200) {
            const parser = new DOMParser();
            const result = parser.parseFromString(
              response.responseText,
              "text/html"
            );

            if (result.querySelector(".media_index_thumb_list") !== null) {
              resolve(await insertCoverAlternative(imdbId));
            }
            let imageElement = result
              .querySelector(".subpage_title_block")
              .querySelector("img");
            if (!imageElement) {
              return resolve(result.querySelector("img.ipc-img").src);
            }
            let thumb_url = imageElement.src;
            let big_cover_found = false;
            if (!result.querySelector(".media_index_thumb_list")) {
              return resolve(thumb_url);
            }
            for (
              let n = 0;
              n <
              result
                .querySelector(".media_index_thumb_list")
                .querySelectorAll("a").length;
              n++
            ) {
              let current_a = result
                .querySelector(".media_index_thumb_list")
                .querySelectorAll("a")[n];
              if (checkImage(current_a, thumb_url) === true) {
                const cover_page = current_a.href.replace(
                  "https://passthepopcorn.me",
                  "https://www.imdb.com"
                );
                const cover = await scrapeAndSetCover(cover_page, thumb_url);
                return resolve(cover);
              }
            }
            if (big_cover_found === false) {
              return resolve(thumb_url);
            }
          } else {
            return reject(`Got ${response.status} when fetching url: ${url}`);
          }
        },
      });
    });
  };
  const fetchPtpImgApiToken = () => {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url: "https://ptpimg.me",
        method: "GET",
        timeout: 10000,
        onload: function (response) {
          if (response.status === 200) {
            const parser = new DOMParser();
            const result = parser.parseFromString(
              response.responseText,
              "text/html"
            );

            if (result.querySelector("#api_key") === null) {
              alert("You should login to your Ptpimg account");
              return reject("No API key found");
            } else {
              return resolve(result.querySelector("#api_key").value);
            }
          }
        },
      });
    });
  };

  const insertCoverAlternative = async (imdbId) => {
    let url = "https://www.imdb.com/title/" + imdbId + "/mediaindex";
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url: url,
        method: "GET",
        timeout: 10000,
        onload: async function (response) {
          if (response.status === 200) {
            const parser = new DOMParser();
            const result = parser.parseFromString(
              response.responseText,
              "text/html"
            );
            let thumb_url = result
              .querySelector(".subpage_title_block")
              .querySelector("img").src;
            let big_cover_found = false;
            for (
              let n = 0;
              n <
              result
                .querySelector(".media_index_thumb_list")
                .querySelectorAll("a").length;
              n++
            ) {
              let current_a = result
                .querySelector(".media_index_thumb_list")
                .querySelectorAll("a")[n];
              if (checkImage(current_a, thumb_url) === true) {
                const cover_page = current_a.href.replace(
                  "https://passthepopcorn.me",
                  "https://www.imdb.com"
                );
                const cover = await scrapeAndSetCover(cover_page, thumb_url);
                return resolve(cover);
              }
            }
            if (big_cover_found === false) {
              return resolve(thumb_url); // if it doesn't find the big cover for some reason, it will use the small thumb as cover
            }
          }
          reject(`Got ${response.status} when fetching url: ${url}`);
        },
      });
    });
  };

  const uploadToPtpimg = async (url, apiKey) => {
    const formData = new FormData();
    formData.append("link-upload", url);
    formData.append("api_key", apiKey);
    const response = await new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url: "https://ptpimg.me/upload.php",
        method: "POST",
        data: formData,
        onload: (response) => {
          if (response.status === 200) {
            return resolve(JSON.parse(response.response));
          } else {
            return reject(`Got ${response.status} when fetching url: ${url}`);
          }
        },
      });
    });
    return `https://ptpimg.me/${response[0].code}.${response[0].ext}`;
  };

  const getPtpImgApiKey = async () => {
    let apiToken = await GM.getValue("ptpimg_api_token", null);
    if (!apiToken) {
      apiToken = await fetchPtpImgApiToken();
      GM.setValue("ptpimg_api_token", apiToken);
    }
    return apiToken;
  };

  const getMeta = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = url;
    });

  const isSmall = async (url) => {
    const img = await getMeta(url);
    console.dir(img.naturalHeight + " " + img.naturalWidth);
    return img.naturalHeight < 150;
  };

  const fetchCoverFromMainPage = async (imdbId) => {
    let url = "https://www.imdb.com/title/" + imdbId;

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url: url,
        method: "GET",
        timeout: 10000,
        onload: async function (response) {
          if (response.status === 200) {
            const parser = new DOMParser();
            const result = parser.parseFromString(
              response.responseText,
              "text/html"
            );
            const images = result.querySelectorAll(
              ".ipc-poster .ipc-poster__poster-image .ipc-image"
            );
            if (images.length > 0) {
              resolve(images[0].src);
            }
          } else {
            return reject(`Got ${response.status} when fetching url: ${url}`);
          }
        },
      });
    });
  };

  let coverInput = document.getElementById("image");
  let triggerButton = document.querySelector("#autofill");
  if (isEditPage()) {
    coverInput = document.getElementsByName("image")[0];
    triggerButton = document.createElement("button");
    triggerButton.textContent = "Fetch";
    coverInput.parentElement.appendChild(triggerButton);
  }
  triggerButton.addEventListener("click", async (event) => {
    try {
      let apiToken = await getPtpImgApiKey();
      let imdbId;
      if (isEditPage()) {
        event.preventDefault();
        imdbId = document.getElementsByName("newimdb")[0].value;
      } else {
        imdbId = document.querySelector("#imdb").value;
      }
      if (imdbId.startsWith("http"))
        imdbId = "tt" + imdbId.split("/tt")[1].split("/")[0];
      let url = await fetchCover(imdbId);
      console.log(url);
      if (!url || (await isSmall(url))) {
        url = await fetchCoverFromMainPage(imdbId);
      }
      coverInput.value = await uploadToPtpimg(url, apiToken);
      coverInput.dispatchEvent(new Event("change"));
    } catch (err) {
      console.trace(err);
    }
  });
  coverInput.addEventListener("change", async (event) => {
    let apiToken = await getPtpImgApiKey();
    const value = event.target.value;
    if (value.indexOf("ptpimg") > -1) return;
    coverInput.value = await uploadToPtpimg(value, apiToken);
    coverInput.dispatchEvent(new Event("change"));
  });
  addListener();
  coverInput.addEventListener("change", async (event) => {
    const cover = event.target.value;
    if (!document.getElementById("cover-preview")) {
      const imgParent = document.createElement("div");
      imgParent.style.position = "absolute";
      imgParent.style.right = "0";
      imgParent.style.maxWidth = "230px";
      imgParent.style.maxHeight = "325px";
      const img = document.createElement("img");
      img.id = "cover-preview";
      img.classList.add("sidebar-cover-image");
      imgParent.appendChild(img);
      coverInput.parentElement.appendChild(imgParent);
    }
    const img = document.getElementById("cover-preview");
    img.src = cover;
  });
})();
