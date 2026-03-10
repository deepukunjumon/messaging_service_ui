export interface EncryptedPayload {
  encrypted: boolean;
  payload: string;
}

const IV_LENGTH = 16; // Must match backend self::IV_LENGTH for AES-256-CBC

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function deriveKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyBytes = encoder.encode(secret);

  // PHP: $key = substr(hash('sha256', $key, true), 0, 32);
  // SHA-256 already produces 32 bytes, so this matches.
  const hashBuffer = await crypto.subtle.digest("SHA-256", keyBytes);

  return crypto.subtle.importKey(
    "raw",
    hashBuffer,
    { name: "AES-CBC" },
    false,
    ["decrypt"],
  );
}

export async function decryptIfNeeded<T = any>(
  data: unknown,
  secret: string | undefined,
): Promise<unknown> {
  if (
    !secret ||
    !data ||
    typeof data !== "object" ||
    (data as EncryptedPayload).encrypted !== true ||
    typeof (data as EncryptedPayload).payload !== "string"
  ) {
    return data;
  }

  const { payload } = data as EncryptedPayload;

  try {
    const decoded = base64ToBytes(payload);
    const iv = decoded.slice(0, IV_LENGTH);
    const ciphertext = decoded.slice(IV_LENGTH);

    const key = await deriveKey(secret);

    const plainBuffer = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      key,
      ciphertext,
    );

    const text = new TextDecoder().decode(plainBuffer);
    return JSON.parse(text) as T;
  } catch (error) {
    console.error("Failed to decrypt backend response", error);
    // Fallback: return original data so UI can still show an error or raw payload
    return data;
  }
}

