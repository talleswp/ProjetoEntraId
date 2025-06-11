export const environment = {
    production: false,
    apiUrl: 'https://localhost:7001/api',
    appName: 'EntraId Dashboard',
    msalConfig: {
        auth: {
        clientId: '', // Application (client) ID from Azure Portal
        authority: 'https://login.microsoftonline.com/{tenantId}/v2.0', // Directory (tenant) ID
        redirectUri: 'http://localhost:4200/auth/callback',
        postLogoutRedirectUri: 'http://localhost:4200'
        },
        cache: {
            cacheLocation: 'localStorage',
            storeAuthStateInCookie: false
        }
    },
    apiConfig: {
        scopes: ['api://{clientId}/access_as_user'],
        uri: 'https://localhost:7001/api'
    },
//   apiConfig: {
//     scopes: ['https://graph.microsoft.com/User.Read'],
//     uri: 'https://localhost:7001/api'
//   }
};
