import { notifications } from "@mantine/notifications";
import axios, { AxiosError, AxiosResponse } from "axios";
import { User, UserLoginValues, UserRegisterValues } from "../models/User";

axios.defaults.baseURL = "http://localhost:5272/api";

const responseBody = <T>(response: AxiosResponse<T>) => response?.data;

axios.interceptors.response.use(
  (value) => value,
  (error: AxiosError) => {
    notifications.show({
      color: "red",
      title: "Error",
      message: error.response?.data as string,
    });
    return Promise.reject(error);
  }
);

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Account = {
  login: (user: UserLoginValues) => requests.post<User>("/users/login", user),
  register: (user: UserRegisterValues) =>
    requests.post<void>("/users/register", user),
};

const agent = {
  Account,
};

export default agent;
