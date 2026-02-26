import axios from "./axios";
import API from "../config/api.config";


export const getAllOutgoingMessages = (payload: any) => {
  return axios.get(API.OUTGOING_MESSAGES.LIST, payload);
};
