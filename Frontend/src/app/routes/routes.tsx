import { createBrowserRouter, RouteObject } from "react-router";
import Login from "../../features/Auth/Login";
import Register from "../../features/Auth/Register";
import HomePage from "../../features/HomePage/HomePage";
import EditorPage from "../../features/EditorPage/EditorPage";
import ImageEditor from "../../features/ImageEditor/ImageEditor";

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
];
export const router = createBrowserRouter(routes);
