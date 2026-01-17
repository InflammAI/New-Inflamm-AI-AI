// Google OAuth 2.0 implementation
export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
}

export interface GoogleOAuthConfig {
  client_id: string;
  redirect_uri?: string;
  scope?: string;
}

class GoogleOAuthService {
  private config: GoogleOAuthConfig;
  private tokenClient: any = null;
  private currentUser: GoogleUser | null = null;
  private initialized = false;

  constructor(config: GoogleOAuthConfig) {
    this.config = {
      scope: 'openid email profile',
      redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
      ...config
    };
  }

  // Initialize Google OAuth
  async init(): Promise<void> {
    if (this.initialized) return;
    
    if (typeof window === 'undefined') {
      throw new Error('Google OAuth can only be initialized in the browser');
    }

    return new Promise((resolve, reject) => {
      // Check if Google Identity Services is already loaded
      if (window.google?.accounts?.oauth2) {
        this.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: this.config.client_id,
          scope: this.config.scope,
          callback: (response: any) => {
            if (response.access_token) {
              this.getUserInfo(response.access_token);
            }
          },
          error_callback: (error: any) => {
            console.error('Google OAuth error:', error);
            reject(error);
          }
        });
        this.initialized = true;
        resolve();
        return;
      }

      // Load Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        try {
          // @ts-ignore - Google global
          const { google } = window;
          if (google?.accounts?.oauth2) {
            this.tokenClient = google.accounts.oauth2.initTokenClient({
              client_id: this.config.client_id,
              scope: this.config.scope,
              callback: (response: any) => {
                if (response.access_token) {
                  this.getUserInfo(response.access_token);
                }
              },
              error_callback: (error: any) => {
                console.error('Google OAuth error:', error);
                reject(error);
              }
            });
            this.initialized = true;
            resolve();
          } else {
            reject(new Error('Google Identity Services failed to load properly'));
          }
        } catch (error) {
          console.error('Error initializing Google Identity Services:', error);
          reject(error);
        }
      };
      
      script.onerror = (error) => {
        console.error('Failed to load Google Identity Services script:', error);
        reject(new Error('Failed to load Google Identity Services. Please check your internet connection.'));
      };
      
      script.onabort = () => {
        reject(new Error('Google Identity Services script loading was aborted'));
      };

      document.head.appendChild(script);
    });
  }

  // Sign in with Google
  async signIn(): Promise<GoogleUser> {
    if (typeof window === 'undefined') {
      throw new Error('Google OAuth can only be used in the browser');
    }

    return new Promise((resolve, reject) => {
      if (!this.tokenClient) {
        reject(new Error('Google OAuth not initialized. Call init() first.'));
        return;
      }

      // Override callback for this specific request
      const originalCallback = this.tokenClient.callback;
      this.tokenClient.callback = (response: any) => {
        if (response.access_token) {
          this.getUserInfo(response.access_token)
            .then(user => {
              this.currentUser = user;
              resolve(user);
            })
            .catch(reject);
        } else {
          reject(new Error('No access token received'));
        }
        // Restore original callback
        this.tokenClient.callback = originalCallback;
      };

      this.tokenClient.requestAccessToken();
    });
  }

  // Get user info from Google API
  private async getUserInfo(accessToken: string): Promise<GoogleUser> {
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  // Sign out
  signOut(): void {
    this.currentUser = null;
    // Revoke token if needed
    // Note: Google tokens are short-lived, so explicit revocation may not be necessary
  }

  // Get current user
  getCurrentUser(): GoogleUser | null {
    return this.currentUser;
  }

  // Check if user is signed in
  isSignedIn(): boolean {
    return this.currentUser !== null;
  }
}

// Create singleton instance
let googleOAuthService: GoogleOAuthService | null = null;

export function initializeGoogleOAuth(config: GoogleOAuthConfig): GoogleOAuthService {
  if (!googleOAuthService) {
    googleOAuthService = new GoogleOAuthService(config);
  }
  return googleOAuthService;
}

export function getGoogleOAuthService(): GoogleOAuthService | null {
  return googleOAuthService;
}

// Export types for TypeScript
declare global {
  interface Window {
    google: any;
  }
}
