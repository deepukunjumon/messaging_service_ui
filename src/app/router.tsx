import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import SendSmsPage from "../features/sms/SendSmsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "sms/send",
        element: <SendSmsPage />,
      },
    ],
  },
]);
