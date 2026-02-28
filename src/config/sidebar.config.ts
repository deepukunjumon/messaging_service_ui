import { MessageSquareText, Home, Mail, Code2, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
  label: string;
  path?: string;
  icon?: LucideIcon;
  children?: SidebarItem[];
}

export const sidebarConfig: SidebarItem[] = [
  {
    label: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    label: "API Clients",
    icon: Users,
    path: "/api-clients",
  },
  {
    label: "SMS",
    icon: MessageSquareText,
    children: [
      {
        label: "Send SMS",
        path: "/sms/send",
        icon: MessageSquareText,
      },
    ],
  },
  {
    label: "Email",
    icon: Mail,
    children: [
      {
        label: "Send Email",
        path: "/email/send",
        icon: Mail,
      },
    ],
  },
  {
    label: "WhatsApp",
    icon: MessageSquareText,
    children: [
      {
        label: "Send WhatsApp",
        path: "/whatsapp/send",
        icon: MessageSquareText,
      },
    ],
  },
  {
    label: "Logs",
    icon: Code2,
    path: "/logs",
  },
];
