import { createContext, useContext } from "react";
import UserStore from "./userStore";
import NewsEditorFormStateStore from "./newsEditorFormStateStore";

interface Store {
  userStore: UserStore;
  newsEditorFormStateStore: NewsEditorFormStateStore;
}

export const store: Store = {
  userStore: new UserStore(),
  newsEditorFormStateStore: new NewsEditorFormStateStore(),
};

export function useStore() {
  return useContext(createContext(store));
}
