export interface Request {
  imdbId: string | null;
  query: string;
  data: {
    size: number | null;
    tags: Array<string> | null;
    format: string | null;
    resolution: string | null;
  };
  dom: HTMLElement;
}

export interface Result {
  size: number;
}

export interface Response {
  results: Array<Result>;
}

export interface tracker {
  canRun(url: string): boolean;

  canUpload(request: Request): Promise<boolean>;

  canBeUsedAsSource(): boolean;

  canBeUsedAsTarget(): boolean;

  getSearchRequest(): Promise<Array<Request>>;

  name(): string;

  insertTrackersSelect(select: HTMLSelectElement): void;
}
