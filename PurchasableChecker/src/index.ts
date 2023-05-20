import tracker_tools from 'common';

console.log('PurchasableChecker loaded');


export const addCounter = () => {
  let div = document.createElement('div');
  div.className = 'counter_div';
  div.innerHTML =
    'Checked: <span class="checked_count">0</span>/<span class="total_requests_count">0</span> | Matched requests: <span class="matched_requests_count">0</span>';
  div.style.padding = '9px 26px';
  div.style.position = 'fixed';
  div.style.top = '50px';
  div.style.right = '50px';
  div.style.background = '#eaeaea';
  div.style.borderRadius = '9px';
  div.style.fontSize = '17px';
  div.style.color = '#111';
  div.style.cursor = 'pointer';
  div.style.border = '2px solid #111';
  div.style.zIndex = '4591363';

  div.addEventListener('click', () => (div.style.display = 'none'));
  document.body.appendChild(div);
};

const updateCount = (count: number) => {
  document.querySelector('.checked_count')!!.textContent = String(count);
};
const updateTotalCount = (count: number) => {
  document.querySelector('.total_requests_count')!!.textContent = String(count);
};

const updateMatchedRequestsCount = (count: number) => {
  document.querySelector('.matched_requests_count')!!.textContent = String(count);
};

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
  updateTotalCount(requestLinks.length)
  let matched = 0
  for (let i = 0; i < requestLinks.length; i++) {
    const requestLink = requestLinks[i] as HTMLAnchorElement
    if (requestLink.parentElement.innerText.includes('Purchasable')) {
      const result = await tracker_tools.http.fetchAndParseHtml(requestLink.href)
      const purchasableLink = getPurchasableLink(result)
      if (purchasableLink) {
        const domain = extractDomain(purchasableLink)
        if (!matches(domainsList, domain)) {
          removeRequest(requestLink);
        } else {
          matched++
          updateMatchedRequestsCount(matched)
        }
      } else {
        removeRequest(requestLink);
      }
    } else {
      removeRequest(requestLink);
    }
    updateCount(i + 1)
  }
}

const saveDomains = async () => {
  let value = $('#domainOptions').val() as string;
  value = value.replace(' ', '')
  await GM.setValue('GMSavedDomains', value);
}

const getDomains = async () => {
  let domainsList: string[] = [];
  const domains: string | null = await GM.getValue('GMSavedDomains')
  if (domains) {
    domainsList = domains.replace(' ', '').split(',');
  }
  return {domainsList, domains};
}

$(document).ready(async () => {

  const path = window.location.pathname
  let {domainsList, domains} = await getDomains();

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

    $('#setdomainOptions').click(async () => {
      await saveDomains();
    });

    $('#filter-purchasable').click(async () => {
      await saveDomains()
      let {domainsList} = await getDomains();
      addCounter()
      await checkRequests(domainsList);
    });
  }
});
