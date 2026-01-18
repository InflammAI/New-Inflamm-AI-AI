import { NextRequest } from 'next/server';

export interface TelegramUser {
  id: number;
  telegramUserId?: number;
  first_name: string;
  last_name?: string;
  username: string;
  language_code: string;
  is_premium?: boolean;
}

export function getTelegramUserFromRequest(req: NextRequest): TelegramUser | null {
  try {
    // Get initData from query params or headers
    const initData = req.nextUrl.searchParams.get('initData') || 
                   req.headers.get('x-telegram-init-data');
    
    if (!initData) {
      return null;
    }

    // Decode the initData (it's URL encoded)
    const decodedData = decodeURIComponent(initData);
    
    // Parse the data (it's a URL query string format)
    const urlParams = new URLSearchParams(decodedData);
    const userStr = urlParams.get('user');
    
    if (!userStr) {
      return null;
    }

    // Parse the user data
    const user = JSON.parse(userStr);
    
    return user;
  } catch (error) {
    console.error('Error parsing Telegram user data:', error);
    return null;
  }
}
