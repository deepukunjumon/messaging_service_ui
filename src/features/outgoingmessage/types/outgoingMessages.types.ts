export type OutgoingMessage = {
  id: number;
  client_id: string;
  api_client: string;
  api_key_id: string;
  channel: string;
  recipient: string;
  subject: string;
  body: string;
  provider: string;
  metadata: string | null;
  status: string;
  created_at: string;
};
