interface Cache {
  [key: string]: Array<string>;
}

interface MemoryCache {
  [key: string]: any;
}

let cache: Cache = await GM.getValue("cache", {} as Cache);
let memoryCache: MemoryCache = {};

export const existsInCache = (tracker: string, key: string) => {
  if (cache[tracker]) {
    return cache[tracker].indexOf(key) > -1;
  }

  return false;
};

export const addToMemoryCache = (key: string, value: any) => {
  memoryCache[key] = value;
};

export const getFromMemoryCache = (key: string): any => {
  return memoryCache[key];
};

export const clearMemoryCache = () => {
  memoryCache = {};
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
