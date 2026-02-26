import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../features/dashboard/Dashboard";
import SendSmsPage from "../features/sms/SendSmsPage";
import OutgoingMessagesPage from "../features/outgoingmessage/pages/OutgoingMessagesPage";

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
        path: "logs",
        element: <OutgoingMessagesPage />,
      }
    ],
  },
]);
