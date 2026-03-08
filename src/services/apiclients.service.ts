import axios from "./axios";
import API from "../config/api.config";

export const createApiClient = (payload: any) => {
  return axios.post(API.API_CLIENTS.CREATE, payload);
};

export const updateApiClient = (id: string, payload: any) => {
  const url = API.API_CLIENTS.UPDATE.replace("{clientId}", id);
  return axios.put(url, payload);
};

export const updateApiClientStatus = (id: string, status: number) => {
  const url = API.API_CLIENTS.UPDATE.replace("{clientId}", id);
  return axios.put(url, { status });
};

export const getApiClientKey = (id: string) => {
  return axios.get(`${API.API_CLIENTS.LIST}/${id}/keys`);
};

export const getAllApiClients = (payload: any) => {
  return axios.get(API.API_CLIENTS.LIST, {
    params: payload,
  });
};
