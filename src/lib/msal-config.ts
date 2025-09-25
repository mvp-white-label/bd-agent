import { Configuration, PopupRequest, RedirectRequest } from '@azure/msal-browser'

// MSAL configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`,
    redirectUri: 'http://localhost:3000',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case 0: // LogLevel.Error
            console.error(message);
            break;
          case 1: // LogLevel.Warning
            console.warn(message);
            break;
          case 2: // LogLevel.Info
            console.info(message);
            break;
          case 3: // LogLevel.Verbose
            console.debug(message);
            break;
        }
      }
    }
  }
}

// Login request configuration for popup
export const loginRequest: PopupRequest = {
  scopes: ['User.Read'],
  prompt: 'select_account',
}

// Login request configuration for redirect
export const redirectRequest: RedirectRequest = {
  scopes: ['User.Read'],
  prompt: 'select_account',
}

// Token request configuration
export const tokenRequest: PopupRequest = {
  scopes: ['User.Read'],
}
