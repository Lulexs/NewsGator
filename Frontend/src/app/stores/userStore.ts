import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import {
  User,
  UserLoginValues,
  UserRegisterValues,
  UserSubscriptions,
} from "../models/User";
import { router } from "../routes/routes";
import { makePersistable } from "mobx-persist-store";

export default class UserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);

    makePersistable(this, {
      name: "UserStore",
      properties: ["user"],
      storage: window.localStorage,
    });
  }

  login = async (value: UserLoginValues) => {
    try {
      const user = await agent.Account.login(value);
      runInAction(() => {
        this.user = user;
      });
      router.navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  register = async (value: UserRegisterValues) => {
    try {
      await agent.Account.register(value);
      router.navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  logout = () => {
    runInAction(() => (this.user = null));
    router.navigate("/");
  };

  updateUserField = (field: keyof User, value: any) => {
    if (!this.user) return;
    runInAction(() => {
      (this.user as any)[field] = value;
    });
  };

  addSubscription = (type: keyof UserSubscriptions, value: string) => {
    if (!this.user) return;
    runInAction(() => {
      if (!this.user!.subscriptions) {
        this.user!.subscriptions = {};
      }
      if (!this.user!.subscriptions![type]) {
        this.user!.subscriptions[type] = [];
      }

      if (!this.user!.subscriptions[type]!.includes(value)) {
        this.user!.subscriptions[type]!.push(value);
      }
    });
  };

  removeSubscription = (type: keyof UserSubscriptions, value: string) => {
    if (!this.user?.subscriptions || !this.user.subscriptions[type]) return;
    runInAction(() => {
      this.user!.subscriptions![type] = this.user!.subscriptions![type]!.filter(
        (item) => item !== value
      );
    });
  };
  removeBookmark = (newsId: string) => {
    if (!this.user?.bookmarks) return;
    runInAction(() => {
      this.user!.bookmarks = this.user!.bookmarks!.filter(
        (bookmark) => bookmark.newsId !== newsId
      );
    });
  };

  saveUser = async () => {
    if (!this.user) return;
    try {
      this.user.bookmarks?.forEach((x) => console.log({ ...x }));
      await agent.Account.updateUser({
        ...this.user,
        bookmarks: this.user.bookmarks?.map((x) => x.newsId),
      });
      console.log(this.user);
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  };
}
