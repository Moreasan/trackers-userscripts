// ==UserScript==
// @name         PTP - Add IMDB Cover
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       passthepopcorn_cc
// @match        https://passthepopcorn.me/upload.php?*
// @match        https://passthepopcorn.me/upload.php
// @match        https://passthepopcorn.me/requests.php*
// @icon         https://www.google.com/s2/favicons?domain=passthepopcorn.me
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// ==/UserScript==


await (async function () {
    'use strict';

    const addListener = () => {
      if (window.location.href.includes('requests.php')) {
        document.querySelectorAll('#request_form > div').forEach((d) => {
          if (d.querySelector('label') !== undefined && d.querySelector('label').textContent.includes('Image:')) {
            d.querySelector('label').style.cursor = 'pointer'
            d.querySelector('label').addEventListener('click', () => {
              window.open(document.querySelector('#image').value, '_blank').focus();
            })
          }
        })
      } else {
        document.querySelectorAll('#upload_table > div').forEach((d) => {
          if (d.querySelector('label') !== undefined && d.querySelector('label').textContent.includes('Cover art')) {
            d.querySelector('label').style.cursor = 'pointer'
            d.querySelector('label').addEventListener('click', () => {
              window.open(document.querySelector('#image').value, '_blank').focus();
            })
          }
        })
      }
    }

    const scrapeAndSetCover = (cover_page, thumb_url) => {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url: cover_page,
          method: 'GET',
          timeout: 10000,
          onload: function (response) {
            if (response.status === 200) {
              const parser = new DOMParser();
              const result = parser.parseFromString(response.responseText, 'text/html');
              let thumb_search = thumb_url.split('/images/M/')[1].split('.')[0]
              let cover_url
              result.querySelectorAll('img').forEach((img) => {
                try {
                  if (thumb_search === img.src.split('/images/M/')[1].split('.')[0]) {
                    cover_url = img.src
                  }
                } catch (e) {
                }
              })
              return resolve(cover_url)
            } else {
              return reject()
            }
          }
        })
      })
    }


    const checkImage = (anchor, thumb_url) => {
      let anchor_search = anchor.querySelector('img').src.split('/images/M/')[1].split('.')[0]
      let thumb_search = thumb_url.split('/images/M/')[1].split('.')[0]
      return anchor_search === thumb_search;

    }


    const fetchCover = async (imdbId) => {
      let url = 'https://www.imdb.com/title/' + imdbId + '/mediaindex?refine=poster'

      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url: url,
          method: 'GET',
          timeout: 10000,
          onload: async function (response) {
            if (response.status === 200) {

              const parser = new DOMParser();
              const result = parser.parseFromString(response.responseText, 'text/html');

              if (result.querySelector('.media_index_thumb_list') !== null) {
                resolve(await insertCoverAlternative());
              }
              if (!result.querySelector('.subpage_title_block').querySelector('img')) {
                return resolve(result.querySelector('img.ipc-img').src)
              }
              let thumb_url = result.querySelector('.subpage_title_block').querySelector('img').src
              let big_cover_found = false
              if (!result.querySelector(".media_index_thumb_list")) {
                return resolve(thumb_url)
              }
              for (let n = 0; n < result.querySelector(".media_index_thumb_list").querySelectorAll("a").length; n++) {
                let current_a = result.querySelector('.media_index_thumb_list').querySelectorAll('a')[n]
                if (checkImage(current_a, thumb_url) === true) {
                  const cover_page = current_a.href.replace('https://passthepopcorn.me', 'https://www.imdb.com')
                  const cover = await scrapeAndSetCover(cover_page, thumb_url)
                  return resolve(cover)
                }
              }
              if (big_cover_found === false) {
                return resolve(thumb_url)
              }

            } else {
              return reject()
            }
          }
        })
      })
    }
    const fetchPtpImgApiToken = () => {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url: 'https://ptpimg.me',
          method: 'GET',
          timeout: 10000,
          onload: function (response) {
            if (response.status === 200) {

              const parser = new DOMParser();
              const result = parser.parseFromString(response.responseText, 'text/html');

              if (result.querySelector('#api_key') === null) {
                alert('You should login to your Ptpimg account')
                return reject()
              } else {
                return resolve(result.querySelector('#api_key').value);
              }
            }
          }
        })
      })
    }

    const insertCoverAlternative = async () => {
      let value = document.querySelector('#imdb').value
      if (value.startsWith('http')) value = 'tt' + value.split('/tt')[1].split('/')[0]
      let url = 'https://www.imdb.com/title/' + value + '/mediaindex'
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url: url,
          method: 'GET',
          timeout: 10000,
          onload: async function (response) {
            if (response.status === 200) {
              const parser = new DOMParser();
              const result = parser.parseFromString(response.responseText, 'text/html');
              let thumb_url = result.querySelector('.subpage_title_block').querySelector('img').src
              let big_cover_found = false
              for (let n = 0; n < result.querySelector(".media_index_thumb_list").querySelectorAll("a").length; n++) {
                let current_a = result.querySelector('.media_index_thumb_list').querySelectorAll('a')[n]
                if (checkImage(current_a, thumb_url) === true) {
                  const cover_page = current_a.href.replace('https://passthepopcorn.me', 'https://www.imdb.com')
                  const cover = await scrapeAndSetCover(cover_page, thumb_url)
                  return resolve(cover)
                }
              }
              if (big_cover_found === false) {
                return resolve(thumb_url) // if it doesn't find the big cover for some reason, it will use the small thumb as cover
              }
            } reject()
          }
        })
      })


    }

    const uploadToPtpimg = async (url, apiKey) => {
      const formData = new FormData();
      formData.append('link-upload', url)
      formData.append('api_key', apiKey)
      const response = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url: 'https://ptpimg.me/upload.php',
          method: 'POST',
          data: formData,
          onload: (response) => {
            if (response.status === 200) {
              return resolve(JSON.parse(response.response))
            } else {
              return reject()
            }
          }
        })
      });
      return `https://ptpimg.me/${response[0].code}.${response[0].ext}`
    }

    const getPtpImgApiKey = async () => {
      let apiToken = await GM.getValue("ptpimg_api_token",null);
      if (!apiToken) {
        apiToken = await fetchPtpImgApiToken()
        GM.setValue("ptpimg_api_token", apiToken);
      }
      return apiToken
    }

    document.querySelector('#autofill')
      .addEventListener('click', async () => {
        let apiToken = await getPtpImgApiKey()
        let value = document.querySelector('#imdb').value
        if (value.startsWith('http')) value = 'tt' + value.split('/tt')[1].split('/')[0]
        const url = await fetchCover(value)
        console.log(url)
        document.getElementById("image").value = await uploadToPtpimg(url, apiToken)
      })
    document.getElementById("image").addEventListener('change', async (event) => {
      let apiToken = await getPtpImgApiKey()
      const value = event.target.value
      if (value.indexOf('ptpimg') > -1) return
      document.getElementById("image").value = await uploadToPtpimg(value, apiToken)
    })
    addListener()
  }
)
();
