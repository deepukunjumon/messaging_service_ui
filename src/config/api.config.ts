const API = {

  DASHBOARD: {
    SERVICE_STATS: "/dashboard/service-stats",
  },

  API_CLIENTS: {
    CREATE: "/api-client",
    UPDATE: "/api-client/{clientId}",
    UPDATE_STATUS: "/api-client/{clientId}/status",
    LIST: "/api-clients",
  },

  API_KEYS: {
    GENERATE: "/api-keys/generate/{clientId}",
    UPDATE_STATUS: "/api-keys/{apiKeyId}/status",
  },

  SMS: {
    SEND: "/sms/send",
  },

  MAIL: {
    SEND: "/email/send",
  },

  OUTGOING_MESSAGES: {
    LIST: "/outgoing-messages",
  },
};

export default API;
