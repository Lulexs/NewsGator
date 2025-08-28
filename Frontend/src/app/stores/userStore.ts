import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User, UserLoginValues, UserRegisterValues } from "../models/User";
import { router } from "../routes/routes";
import { makePersistable } from "mobx-persist-store";
import { notifications } from "@mantine/notifications";

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
      notifications.show({
        title: "Success!",
        message: "Your registration was successful. You can now log in.",
        color: "green",
      });
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

  saveUser = async (
    newEmail: string,
    selectedAvatar: number,
    localSubs: any,
    bookmarks: string[]
  ) => {
    if (!this.user) return;

    try {
      if (/^\S+@\S+$/.test(newEmail) == false) {
        notifications.show({
          title: "Invalid email",
          message: "Please enter a valid email address.",
          color: "red",
        });
        return;
      }

      const user = await agent.Account.updateUser({
        ...this.user,
        email: newEmail,
        avatar: `https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-${selectedAvatar}.png`,
        subscriptions: localSubs,
        bookmarks: bookmarks,
      });

      runInAction(() => {
        this.user = user;
        notifications.show({
          title: "Success!",
          message: "Your profile has been updated.",
          color: "green",
        });
      });
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  };
}
