import axios from "./axios";
import API from "../config/api.config";

export interface SendMailPayload {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    body: string;
    attachments?: {
        name: string;
        content: string;
    }[];
}

export const sendMail = (payload: SendMailPayload, apiKey: string) => {
  return axios.post(API.MAIL.SEND, payload, {
    headers: {
      "x-api-key": apiKey,
    },
  });
};
