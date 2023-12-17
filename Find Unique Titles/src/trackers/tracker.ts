export interface Torrent {
  container?: string | null;
  size: number | null;
  tags: Array<string> | null;
  format?: string | null;
  resolution?: Resolution;
  dom: HTMLElement;
}

export enum Resolution {
  SD = "SD",
  HD = "HD",
  FHD = "FHD",
  UHD = "UHD",
}

export enum Category {
  TV = "TV",
  MOVIE = "MOVIE",
  MUSIC = "MUSIC",
  BOOK = "BOOK",
  AUDIOBOOK = "AUDIOBOOK",
  SPORT = "SPORT",
  ANIME = "ANIME",
  MV = "MV",
  LIVE_PERFORMANCE = "PERFORMANCE",
  STAND_UP = "UP",
  DOCUMENTARY = "DOCUMENTARY",
  GAME = "GAME",
  XXX = "XXX",
  OTHER = "OTHER",
}

export interface Request<Category> {
  year?: number;
  torrents: Array<Torrent>;
  dom: Array<HTMLElement>;
  category?: Category;
}

export interface MovieRequest extends Request<Category.MOVIE> {
  imdbId: string | null;
  title?: string;
}

export interface TVRequest extends Request<Category.TV> {
  imdbId: string | null;
  title?: string;
  season?: string;
  episode?: string;
}

export interface MusicRequest extends Request<Category.MUSIC> {
  title?: string;
  artist?: string;
  type?: MusicReleaseType;
}

export enum MusicReleaseType {
  ALBUM = "ALBUM",
  SINGLE = "SINGLE",
  TV_MUSIC = "TV_MUSIC",
}

export interface MetaData {
  total: number;
}

export enum SearchResult {
  EXIST = "EXIST",
  EXIST_BUT_MISSING_SLOT = "EXIST_BUT_MISSING_SLOT",
  NOT_EXIST = "NOT_EXIST",
  MAYBE_NOT_EXIST = "MAYBE_NOT_EXIST",
  NOT_EXIST_WITH_REQUEST = "NOT_EXIST_WITH_REQUEST",
  MAYBE_NOT_EXIST_WITH_REQUEST = "MAYBE_NOT_EXIST_WITH_REQUEST",
  NOT_CHECKED = "NOT_CHECKED",
  NOT_LOGGED_IN = "NOT_LOGGED_IN",
  NOT_ALLOWED = "NOT_ALLOWED",
}

export interface tracker {
  canRun(url: string): boolean;

  search(request: Request): Promise<SearchResult>;

  canBeUsedAsSource(): boolean;

  canBeUsedAsTarget(): boolean;

  getSearchRequest(): AsyncGenerator<MetaData | Request, void, void>;

  name(): string;

  insertTrackersSelect(select: HTMLSelectElement): void;
}

export const toGenerator = async function* (
  requests: Array<Request>
): AsyncGenerator<MetaData | Request, void, void> {
  yield {
    total: requests.length,
  };
  for (const request of requests) {
    yield request;
  }
};
