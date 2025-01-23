import { notifications } from "@mantine/notifications";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
  UpdateUserValues,
  User,
  UserLoginValues,
  UserRegisterValues,
} from "../models/User";
import { EditorPageSimplifiedNews, News } from "../models/News";
import { Review } from "../models/Review";
import { HomePagePoll, Poll } from "../models/Poll";

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
  updateUser: (user: UpdateUserValues) =>
    requests.put<void>("/Users/update", user),
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

  getFilteredDataForEditor: (title: string) =>
    requests.get<EditorPageSimplifiedNews[]>(`/News/filter/?filter=${title}`),
};

const HomePageNewsAgent = {
  getMostPopular: () =>
    requests.get<EditorPageSimplifiedNews[]>("/News/mostpopular"),
  getMostRecent: ({ pageParam }: any) =>
    requests.get<{ data: EditorPageSimplifiedNews[]; nextCursor: number }>(
      `/News/mostrecent?cursor=${pageParam}`
    ),
  getSingleNews: (userId: string, newsId: string) =>
    requests.get<News>(`/News/forreader/${userId}/${newsId}`),
  getFiltered: ({ pageParam, filterData }: any) =>
    requests.post<{ data: EditorPageSimplifiedNews[]; nextCursor: number }>(
      `/News/filter?cursor=${pageParam}`,
      filterData
    ),
};

const NewsPageAgent = {
  getReviews: (newsId: string) =>
    requests.get<Review[]>(`/News/reviews/${newsId}`),
  leaveReview: (review: Review) =>
    requests.post<void>(`/News/reviews`, {
      Value: review.value,
      Comment: review.comment,
      Commenter: review.commenter,
      Avatar: review.avatar,
    }),
  upvoteDownvote: (newsId: string, userId: string, action: number) =>
    requests.put(`/News/upvotedownvote`, {
      NewsId: newsId,
      UserId: userId,
      Action: action,
    }),
};

const PollsAgent = {
  createPoll: (poll: Poll) => requests.post<Poll>("/Polls", poll),
  getPollsForEditor: () => requests.get<Poll[]>("/Polls"),
  getPollForHome: (userId: string) =>
    requests.get<HomePagePoll>(`/Polls/latest/${userId}`),
  deletePoll: (pollId: string) => requests.del<void>(`/Polls/${pollId}`),
  vote: (pollId: string, userId: string, option: string) =>
    requests.put("/Polls/vote", {
      PollId: pollId,
      UserId: userId,
      Option: option,
    }),
};

const agent = {
  Account,
  NewsAgent,
  HomePageNewsAgent,
  NewsPageAgent,
  PollsAgent,
};

export default agent;
