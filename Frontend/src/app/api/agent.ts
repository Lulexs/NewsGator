import { notifications } from "@mantine/notifications";
import axios, { AxiosError, AxiosResponse } from "axios";
import { User, UserLoginValues, UserRegisterValues } from "../models/User";
import { EditorPageSimplifiedNews, News } from "../models/News";

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
  post: <T>(url: string, body: {}, headers: {} = {}) =>
    axios.post<T>(url, body, { headers }).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Account = {
  login: (user: UserLoginValues) => requests.post<User>("/Users/login", user),
  register: (user: UserRegisterValues) =>
    requests.post<void>("/Users/register", user),
};

const NewsAgent = {
  getSingleNews: (newsId: string) => requests.get<News>(`/News/${newsId}`),
  getNewsFromUrl: (newsUrl: string) =>
    requests.post<string>("/NewsPage/acquire", newsUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    }),
  cropImage: (
    imageName: string,
    top: number,
    left: number,
    bottom: number,
    right: number
  ) =>
    requests.post("/NewsPage/crop", {
      imageName,
      top,
      left,
      bottom,
      right,
    }),

  newNews: (news: any) => requests.post("/News", news),
  getEditorNews: ({ pageParam }: any) =>
    requests.get<{ data: EditorPageSimplifiedNews[]; nextCursor: number }>(
      `/News?cursor=${pageParam}`
    ),
  updateNews: (newsId: string, news: any) =>
    requests.put(`/News/${newsId}`, news),
};

const agent = {
  Account,
  NewsAgent,
};

export default agent;
