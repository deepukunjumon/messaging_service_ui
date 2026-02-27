import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../features/dashboard/Dashboard";
import SendSmsPage from "../features/sms/SendSmsPage";
import OutgoingMessagesPage from "../features/outgoingmessage/pages/OutgoingMessagesPage";
import NotFound from "../features/error/NotFound";
import SendMailPage from "../features/email/SendMailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "sms/send",
        element: <SendSmsPage />,
      },
      {
        path: "email/send",
        element: <SendMailPage />,
      },
      {
        path: "logs",
        element: <OutgoingMessagesPage />,
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
