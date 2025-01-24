import { ThumbnailedNews } from "./News";

export interface CreateTimelineValues {
  name: string;
  newsIds: string[];
}

export interface UpdateTimelineValues {
  id: string;
  name: string;
  newsIds: string[];
}

export interface Timeline {
  id: string;
  name: string;
  News?: ThumbnailedNews[];
}
