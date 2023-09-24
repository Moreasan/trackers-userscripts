export interface Torrent {
  container?: string | null;
  size: number | null;
  tags: Array<string> | null;
  format?: string | null;
  resolution?: string | null;
  dom: HTMLElement | null;
}

export enum Category {
  TV,
  MOVIE,
  MUSIC,
  BOOK,
  AUDIOBOOK,
}

export interface Request {
  imdbId: string | null;
  query: string;
  torrents: Array<Torrent>;
  dom: Element;
  category?: Category;
}

export interface Result {
  size: number;
}

export interface Response {
  results: Array<Result>;
}

export interface tracker {
  canRun(url: string): boolean;

  canUpload(request: Request, onlyNewTitle: boolean): Promise<boolean>;

  canBeUsedAsSource(): boolean;

  canBeUsedAsTarget(): boolean;

  getSearchRequest(): Promise<Array<Request>>;

  name(): string;

  insertTrackersSelect(select: HTMLSelectElement): void;
}
