import axios from "./axios";
import API from "../config/api.config";

export const getAllApiClients = (payload: any) => {
    return axios.get(API.API_CLIENTS.LIST, {
        params: payload,
    });
}