import tracker_tools from 'common';

console.log('PurchasableChecker loaded');


const extractDomain = (url: string) => {
  let domain = (new URL(url));
  return domain.hostname
}

const getPurchasableLink = (html: HTMLElement) => {
  const tds = html.querySelectorAll('#request-table td')
  for (let i = 0; i < tds.length; i++) {
    if (tds[i].textContent.includes('Purchasable at')) {
      return tds[i + 1].querySelector('a').href
    }
  }
  return null
}

function removeRequest(requestLink: HTMLAnchorElement) {
  requestLink.parentElement.parentElement.remove()
}

const matches = (domainsList, domain: string) => {
  for (let wantedDomain of domainsList) {
    if (wantedDomain.includes(domain) || domain.includes(wantedDomain)) {
      return true;
    }
  }
  return false;
}

const checkRequests = async (domainsList) => {
  const requestLinks = $('a[class="l_movie"]');
  for (let i = 0; i < requestLinks.length; i++) {
    const requestLink = requestLinks[i] as HTMLAnchorElement
    if (requestLink.parentElement.innerText.includes('Purchasable')) {
      const result = await tracker_tools.http.fetchAndParseHtml(requestLink.href)
      const purchasableLink = getPurchasableLink(result)
      if (purchasableLink) {
        const domain = extractDomain(purchasableLink)
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
}

$(document).ready(async () => {

  const path = window.location.pathname
  let domainsList: string[] = [];
  const domains: string | null = await GM.getValue('GMSavedDomains')
  console.log(path);
// Load saved settings if they exist
  if (domains) {
    domainsList = domains.split(',');
  }

// Check and run different parts of the script on appropriate pages

// Main request page
  if (/^\/requests.php(?:\/)?$/.test(path)) {
    console.log('Page match: "slash" "requests" "slash or nothing"');

    const searchForm = $('form[id="request-search-form"]');

    // Input field for users libraries
    $(searchForm)
      .prepend(
        '<tr><td style="padding-bottom:20px;" class="Flabel"><label for="domainOptions">Search string:</label></td>' +
        '<td class="Ffield"><input style="margin-right: 20px;margin-left: 15px;" id="domainOptions" type="text" value="" name="domainOptions" size="95">' +
        '<span class="search-form__footer__buttons">' +
        '<input id="setdomainOptions" value="Set" type="button" role="button"></input></span>' +
        '<td>' +
        '<span class="search-form__footer__buttons">' +
        '<input id="filter-purchasable" value="Filter" type="button" role="button"></input></span>' +
        '<td>' +
        '</tr><br>');

    $('#domainOptions').val(domains);

    $('#setdomainOptions').click(function () {
      GM.setValue('GMSavedDomains', $('#domainOptions').val());
    });

    $('#filter-purchasable').click(async () => {
      await checkRequests(domainsList);
    });
  }
});
