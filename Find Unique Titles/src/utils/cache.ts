interface Cache {
  [key: string]: Array<string>;
}

let cache: Cache = await GM.getValue("cache", {} as Cache);

export const existsInCache = (tracker: string, key: string) => {
  if (cache[tracker]) {
    return cache[tracker].indexOf(key) > -1;
  }

  return false;
};

export const addToCache = async (tracker: string, imdb_id: string) => {
  let tracker_cache = cache[tracker];
  if (!tracker_cache) {
    tracker_cache = [];
  }
  tracker_cache.push(imdb_id);
  cache[tracker] = tracker_cache;
  await GM.setValue("cache", cache);
};
