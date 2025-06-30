// src/utils/jwt.ts
export function parseJwt(token: string): { exp?: number } | null {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (err) {
    return null;
  }
}
