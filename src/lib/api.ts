
/**
 * API service layer - ready for Supabase integration
 * This file will handle all API calls when backend is connected
 */

export interface UrlData {
  id?: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: Date;
  userId?: string;
}

// Mock API functions - replace with real Supabase calls later
export const urlService = {
  async createShortUrl(originalUrl: string, userId?: string): Promise<UrlData> {
    // TODO: Replace with Supabase API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Math.random().toString(36),
          originalUrl,
          shortCode: Math.random().toString(36).substring(2, 8),
          clicks: 0,
          createdAt: new Date(),
          userId,
        });
      }, 1000);
    });
  },

  async getUserUrls(userId: string): Promise<UrlData[]> {
    // TODO: Replace with Supabase API call
    return [];
  },

  async getUrlByShortCode(shortCode: string): Promise<UrlData | null> {
    // TODO: Replace with Supabase API call
    return null;
  },

  async incrementClickCount(shortCode: string): Promise<void> {
    // TODO: Replace with Supabase API call
    console.log(`Incrementing clicks for ${shortCode}`);
  },
};
