export interface ThumbnailedNews {
  newsId: string;
  title: string;
  thumbnail?: string;
}

export interface NewspaperNews {
  newspaper: string;
  thumbnail?: string;
  author?: string;
  url: string;
  date?: Date;
  content: string;
  tags: string[];
  category: string;
}

export interface CommunityNote {
  text: string;
  action: number;
  upvotes: number;
  downvotes: number;
}

export interface News {
  id: string;
  title: string;
  createdAt: Date;
  thumbnail?: string;
  location?: string;
  communityNote?: CommunityNote;
  newspaperNews?: NewspaperNews[];
}

export interface EditorPageSimplifiedNews {
  id: string;
  title: string;
  createdAt: Date;
  thumbnail?: string;
}
