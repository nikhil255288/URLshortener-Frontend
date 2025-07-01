const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export interface UrlData {
  id?: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: Date;
  userId?: string;
}

export const urlService = {
  async createShortUrl(originalUrl: string, userId?: string): Promise<UrlData> {
    const response = await fetch(`${API_BASE_URL}/url/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // if using JWT
      },
      body: JSON.stringify({ originalUrl, userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to shorten URL");
    }

    return response.json();
  },

  async getUserUrls(userId: string): Promise<UrlData[]> {
    const response = await fetch(`${API_BASE_URL}/url/history`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch URLs");
    }

    return response.json();
  },

  async getUrlByShortCode(shortCode: string): Promise<UrlData | null> {
    const response = await fetch(`${API_BASE_URL}/url/${shortCode}`);

    if (!response.ok) {
      return null;
    }

    return response.json();
  },

  async incrementClickCount(shortCode: string): Promise<void> {
    await fetch(`${API_BASE_URL}/url/click/${shortCode}`, {
      method: "POST",
    });
  },
};
