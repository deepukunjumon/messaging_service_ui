import axios from "./axios";
import API from "../config/api.config";

export interface SendSmsPayload {
  phoneNumbers: string[];
  content: string;
  dlt_template_id: string;
}

export const sendSms = (payload: SendSmsPayload, apiKey: string) => {
  return axios.post(API.SMS.SEND, payload, {
    headers: {
      "X-API-KEY": apiKey,
    },
  });
};
