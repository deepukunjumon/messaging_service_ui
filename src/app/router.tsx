import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../features/dashboard/pages/Dashboard";
import SendSmsPage from "../features/sms/SendSmsPage";
import OutgoingMessagesPage from "../features/outgoingmessage/pages/OutgoingMessagesPage";
import NotFound from "../features/error/NotFound";
import SendMailPage from "../features/email/SendMailPage";
import APIClientsPage from "../features/apiclients/pages/ApiClientsPage";
import APIClientKeysPage from "../features/apiclients/pages/ApiClientKeysPage";

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
        path: "api-clients",
        element: <APIClientsPage />,
      },
      {
        path: "api-clients/:clientId/keys",
        element: <APIClientKeysPage />,
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
