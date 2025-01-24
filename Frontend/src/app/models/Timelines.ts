export interface CreateTimelineValues {
  name: string;
  newsIds: string[];
}

export interface UpdateTimelineValues {
  id: string;
  name: string;
  newsIds: string[];
}

export interface TimelineNews {
  id: string;
  title: string;
  thumbnail?: string;
}

export interface Timeline {
  id: string;
  name: string;
  news?: TimelineNews[];
}
