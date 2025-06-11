export const environment = {
  production: ${PRODUCTION || false},
  apiUrl: '${API_URL || http://localhost:7001/api}',
  appName: '${APP_NAME || EntraId Dashboard}',
  
  msalConfig: {
    auth: {
      clientId: '${AZURE_CLIENT_ID}',
      authority: 'https://login.microsoftonline.com/${AZURE_TENANT_ID}/v2.0',
      redirectUri: '${REDIRECT_URI || http://localhost:4200/auth/callback}',
      postLogoutRedirectUri: '${POST_LOGOUT_REDIRECT_URI || http://localhost:4200}'
    },
    cache: {
      cacheLocation: '${CACHE_LOCATION || localStorage}',
      storeAuthStateInCookie: ${STORE_AUTH_STATE_IN_COOKIE || false}
    }
  },
  
  apiConfig: {
    scopes: ['${API_SCOPES || api://default-scope/access_as_user}'],
    uri: '${API_URI || http://localhost:5000/api}'
  },
  
  // Configurações opcionais
  debug: ${DEBUG || false},
  enableMockData: ${ENABLE_MOCK_DATA || false},
  logLevel: '${LOG_LEVEL || info}',
  
  features: {
    enableDevTools: ${ENABLE_DEV_TOOLS || false},
    enableConsoleLogging: ${ENABLE_CONSOLE_LOGGING || true},
    enablePerformanceMetrics: ${ENABLE_PERFORMANCE_METRICS || false}
  }
};