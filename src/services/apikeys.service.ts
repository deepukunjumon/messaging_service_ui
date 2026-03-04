import axios from "./axios";
import API from "../config/api.config";

export const updateApiKeyStatus = (payload: any) => {
    return axios.post(API.API_KEYS.UPDATE_STATUS, payload);
}
