export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api',
  appName: 'EntraId Dashboard',
  msalConfig: {
    auth: {
      clientId: 'your-prod-client-id',
      authority: 'https://login.microsoftonline.com/your-tenant-id',
      redirectUri: 'https://your-domain.com/auth/callback',
      postLogoutRedirectUri: 'https://your-domain.com'
    },
    apiConfig: {
        scopes: ['api://SEU-CLIENT-ID-DA-API/access_as_user'],
        uri: 'https://localhost:7001/api'
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true
    }
  },
  apiConfig: {
    scopes: ['https://graph.microsoft.com/User.Read'],
    uri: 'https://your-production-api.com/api'
  }
};