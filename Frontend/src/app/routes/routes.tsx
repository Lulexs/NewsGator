import { createBrowserRouter, RouteObject } from "react-router";
import Login from "../../features/Auth/Login";
import Register from "../../features/Auth/Register";
import HomePage from "../../features/HomePage/HomePage";
import EditorPage from "../../features/EditorPage/EditorPage";
import ImageEditor from "../../features/ImageEditor/ImageEditor";
import NewsPage from "../../features/NewsPage/NewsPage";

export const routes: RouteObject[] = [
  { path: "", element: <HomePage /> },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/editorpage",
    element: <EditorPage />,
  },
  {
    path: "/imageeditor/:image",
    element: <ImageEditor />,
  },
  {
    path: "/news/:newsid",
    element: <NewsPage />,
  },
];
export const router = createBrowserRouter(routes);
