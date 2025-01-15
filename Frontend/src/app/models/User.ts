export enum UserRole {
  Editor,
  Reader,
}

export interface UserSubscriptions {
  categories?: string[];
  authros?: string[];
  news?: string[];
}

export interface User {
  username: string;
  email: string;
  password: string;
  avatar: string;
  role: UserRole;
  subscriptions?: UserSubscriptions;
  bookmarks?: string[];
}

export interface UserLoginValues {
  username: string;
  password: string;
}

export interface UserRegisterValues {
  username: string;
  email: string;
  password: string;
  avatar: string;
}
