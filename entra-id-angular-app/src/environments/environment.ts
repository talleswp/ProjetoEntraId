export const environment = {
    production: false,
    apiUrl: 'https://localhost:7001/api',
    appName: 'EntraId Dashboard',
    msalConfig: {
        auth: {
        clientId: '30a0482e-3109-4177-b742-1fd9a7705e99', // Application (client) ID from Azure Portal
        authority: 'https://login.microsoftonline.com/a8dc763c-983c-4735-a07c-c741e4093167/v2.0', // Directory (tenant) ID
        redirectUri: 'http://localhost:4200/auth/callback',
        postLogoutRedirectUri: 'http://localhost:4200'
        },
        cache: {
            cacheLocation: 'localStorage',
            storeAuthStateInCookie: false
        }
    },
    apiConfig: {
        scopes: ['api://e603ab59-d889-489e-9b66-9eecea964688/access_as_user'],
        uri: 'https://localhost:7001/api'
    },
//   apiConfig: {
//     scopes: ['https://graph.microsoft.com/User.Read'],
//     uri: 'https://localhost:7001/api'
//   }
};