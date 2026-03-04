import axios from "./axios";
import API from "../config/api.config";

export const createApiClient = (payload: any) => {
    return axios.post(API.API_CLIENTS.CREATE, payload);
}

export const getApiClientKey = (id: string) => {
    return axios.get(`${API.API_CLIENTS.LIST}/${id}/keys`);
}

export const getAllApiClients = (payload: any) => {
    return axios.get(API.API_CLIENTS.LIST, {
        params: payload,
    });
}