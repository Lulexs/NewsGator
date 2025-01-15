import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User, UserLoginValues } from "../models/User";
import { router } from "../routes/routes";

export default class UserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  login = async (value: UserLoginValues) => {
    try {
      const user = await agent.Account.login(value);
      runInAction(() => (this.user = user));
      router.navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  register = async (value: User) => {
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
}
