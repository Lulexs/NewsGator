import { ThumbnailedNews } from "./News";

export enum UserRole {
  Editor,
  Reader,
}

export interface UserSubscriptions {
  categories?: string[];
  authors?: string[];
  newspapers?: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: UserRole;
  subscriptions?: UserSubscriptions;
  bookmarks?: ThumbnailedNews[];
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

export interface UpdateUserValues {
  id: string;
  avatar?: string;
  email?: string;
  subscriptions?: UserSubscriptions;
  bookmarks?: string[];
}
