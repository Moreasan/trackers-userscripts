import GM_fetch from "@trim21/gm-fetch";
import { logger } from "../logger/index.js";

const parser = new DOMParser();

export const fetchUrl = async (
  input: RequestInfo | URL,
  options: RequestInit = {},
  wait = 1000
) => {
  await sleep(wait);
  logger.debug("Will fetch {0}", input)
  const res = await GM_fetch(input, options);
  return await res.text();
};

export const fetchAndParseHtml = async (query_url: string) => {
  const response = await fetchUrl(query_url);
  return parser.parseFromString(response, "text/html").body;
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
