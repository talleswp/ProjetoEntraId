export const environment = {
    production: false,
    apiUrl: 'https://localhost:7001/api',
    appName: 'EntraId Dashboard',
    msalConfig: {
        auth: {
            clientId: '485bf9c8-8809-47ec-b7cb-d8d0c5754e34', // Application (client) ID from Azure Portal
            authority: 'https://login.microsoftonline.com/cdf67493-7e6d-42cd-a849-8fa9d8757d3f/v2.0', // Directory (tenant) ID
            redirectUri: 'http://localhost:4201/auth/callback',
            postLogoutRedirectUri: 'http://localhost:4201'
        },
        cache: {
            cacheLocation: 'localStorage',
            storeAuthStateInCookie: false
        }
    },
    apiConfig: {
        scopes: ['api://22e540d0-a5d0-4757-b0d6-de1cb2598fb7/access_as_user'],
        uri: 'https://localhost:7001/api'
    },
};