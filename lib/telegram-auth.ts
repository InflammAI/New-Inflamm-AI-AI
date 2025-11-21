import crypto from 'crypto';

interface TelegramInitData {
  query_id?: string;
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
  };
  auth_date: number;
  hash: string;
}

/**
 * Validates Telegram Mini App initData using HMAC signature verification
 * According to: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateTelegramInitData(initData: string, botToken: string): TelegramInitData | null {
  try {
    // Parse initData manually - preserve exact encoding for HMAC validation
    const rawParams: Record<string, string> = {};
    const decodedParams: Record<string, string> = {};
    let hash = '';
    
    // Split by & and parse each key=value pair
    const pairs = initData.split('&');
    for (const pair of pairs) {
      const equalIndex = pair.indexOf('=');
      if (equalIndex === -1) continue;
      
      const key = pair.substring(0, equalIndex);
      const rawValue = pair.substring(equalIndex + 1);
      
      if (key === 'hash') {
        hash = rawValue;
      } else if (key) {
        // Store raw (encoded) value for HMAC validation
        rawParams[key] = rawValue;
        // Store decoded value for parsing (handle + as space, then decode percent-encoding)
        decodedParams[key] = decodeURIComponent(rawValue.replace(/\+/g, ' '));
      }
    }
    
    if (!hash) {
      console.error('No hash in initData');
      return null;
    }

    // Sort parameters alphabetically and create data-check-string using RAW values
    const dataCheckString = Object.keys(rawParams)
      .sort()
      .map(key => `${key}=${rawParams[key]}`)
      .join('\n');

    // Create secret key from bot token
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Calculate expected hash
    const expectedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Verify hash
    if (expectedHash !== hash) {
      console.error('Invalid hash signature', { expected: expectedHash, received: hash });
      return null;
    }

    // Check auth_date (not older than 24 hours) - use decoded params for parsing
    const authDate = parseInt(decodedParams['auth_date'] || '0');
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      console.error('initData is too old');
      return null;
    }

    // Parse user data - use decoded params
    const userData = decodedParams['user'];
    if (!userData) {
      console.error('No user data in initData');
      return null;
    }

    const user = JSON.parse(userData);
    
    return {
      query_id: decodedParams['query_id'] || undefined,
      user,
      auth_date: authDate,
      hash
    };
  } catch (error) {
    console.error('Error validating Telegram initData:', error);
    return null;
  }
}

/**
 * Middleware-style function to extract and validate Telegram user from request
 */
export async function getTelegramUserFromRequest(
  request: Request
): Promise<{ telegramUserId: string; user: any } | null> {
  const authHeader = request.headers.get('X-Telegram-Init-Data');
  
  if (!authHeader) {
    console.error('No X-Telegram-Init-Data header');
    return null;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN not configured');
    return null;
  }

  const validatedData = validateTelegramInitData(authHeader, botToken);
  
  if (!validatedData || !validatedData.user) {
    return null;
  }

  return {
    telegramUserId: String(validatedData.user.id),
    user: validatedData.user
  };
}
