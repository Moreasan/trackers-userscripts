export interface Torrent {
  container?: string | null;
  size: number | null;
  tags: Array<string> | null;
  format?: string | null;
  resolution?: string | null;
  dom: HTMLElement;
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

export interface Request {
  imdbId: string | null;
  title?: string;
  year?: number;
  torrents: Array<Torrent>;
  dom: Array<HTMLElement>;
  category?: Category;
}

export interface MetaData {
  total: number;
}

export enum SearchResult {
  EXIST,
  EXIST_BUT_MISSING_SLOT,
  NOT_EXIST,
  MAYBE_NOT_EXIST,
  NOT_EXIST_WITH_REQUEST,
  MAYBE_NOT_EXIST_WITH_REQUEST,
  NOT_CHECKED,
  NOT_LOGGED_IN,
  NOT_ALLOWED
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
