import GM_fetch from "@trim21/gm-fetch";

const parser = new DOMParser();

export const fetchUrl = async (url: string, wait = 1000) => {
  await sleep(wait);
  const res = await GM_fetch(url);
  return await res.text();
};

export const fetchAndParseHtml = async (query_url: string) => {
  const response = await fetchUrl(query_url);
  return parser.parseFromString(response, "text/html").body;
}

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
