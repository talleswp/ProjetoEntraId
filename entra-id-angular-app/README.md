# EntraId Angular Dashboard

Dashboard moderno em Angular 17+ com PrimeNG 17+ e autenticação MSAL para Azure Active Directory.

## 🚀 Tecnologias

- **Angular 17+** - Framework principal com standalone components
- **PrimeNG 17+** - Biblioteca de componentes UI com tema md-light-indigo
- **MSAL Angular** - Autenticação Microsoft Azure AD
- **TypeScript 5.4+** - Linguagem de programação
- **SCSS** - Pré-processador CSS
- **RxJS** - Programação reativa
- **Signals** - Estado reativo do Angular

## 🎨 Características

### Design
- ✅ **Tema md-light-indigo** do PrimeNG
- ✅ **Logo personalizado** Azure Brasil
- ✅ **Design responsivo** mobile-first
- ✅ **Dark mode** automático
- ✅ **Animações** suaves
- ✅ **Tipografia** moderna

### Funcionalidades
- ✅ **Login MSAL** com popup/redirect
- ✅ **Dashboard** com métricas
- ✅ **Perfil do usuário** detalhado
- ✅ **Lista de usuários** do tenant
- ✅ **Lista de grupos** do tenant
- ✅ **Tentativas de login** recentes
- ✅ **Refresh automático** de dados
- ✅ **Navegação** com menu
- ✅ **Notificações** toast
- ✅ **Loading states** elegantes

### Arquitetura
- ✅ **Standalone Components** Angular 17+
- ✅ **Signal-based** state management
- ✅ **Lazy loading** de rotas
- ✅ **Guards** de autenticação
- ✅ **Interceptors** HTTP
- ✅ **Services** organizados
- ✅ **TypeScript strict** mode

## 🔧 Configuração

### 1. Pré-requisitos

```bash
# Node.js 18+ e npm
node --version  # v18+
npm --version   # v9+

# Angular CLI 17+
npm install -g @angular/cli@17
ng version
```

### 2. Instalar Dependências

```bash
# No diretório do projeto
npm install
```

### 3. Configurar Azure App Registration

1. **Azure Portal** → Azure Active Directory → App registrations
2. **New registration**:
   - Name: `EntraId Angular App`
   - Supported account types: `Single tenant`
   - Redirect URI: `Single-page application (SPA)` → `http://localhost:4200/auth/callback`

3. **Authentication**:
   - Add redirect URI: `http://localhost:4200`
   - Enable `Access tokens` and `ID tokens`
   - Configure logout URL: `http://localhost:4200`

4. **API permissions**:
   - Microsoft Graph → Delegated permissions:
     - `User.Read`
     - `Directory.Read.All`
     - `Group.Read.All`
     - `AuditLog.Read.All`
   - Grant admin consent

5. **Certificates & secrets**:
   - New client secret (para API backend)
   - Copy secret value

### 4. Configurar environment.ts

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001/api',
  appName: 'EntraId Dashboard',
  msalConfig: {
    auth: {
      clientId: 'SEU-CLIENT-ID-AQUI',
      authority: 'https://login.microsoftonline.com/SEU-TENANT-ID-AQUI',
      redirectUri: 'http://localhost:4200/auth/callback',
      postLogoutRedirectUri: 'http://localhost:4200'
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false
    }
  },
  apiConfig: {
    scopes: ['https://graph.microsoft.com/User.Read'],
    uri: 'https://localhost:7001/api'
  }
};
```

### 5. Executar

```bash
# Desenvolvimento
npm start

# Build para produção
npm run build:prod
```

## 🌐 URLs

- **Desenvolvimento**: http://localhost:4200
- **Login**: http://localhost:4200/auth/login
- **Dashboard**: http://localhost:4200/dashboard
- **Perfil**: http://localhost:4200/profile

## 📱 Interface

### Login
- **Autenticação MSAL** com popup Microsoft
- **Logo Azure Brasil** personalizado
- **Loading states** durante autenticação
- **Error handling** com mensagens claras

### Dashboard
- **Cartões de métricas** responsivos
- **Tabelas de dados** com paginação
- **Avatars** com iniciais dos usuários
- **Tags de status** coloridas
- **Refresh button** para atualizar dados

### Perfil
- **Informações detalhadas** do usuário
- **Actions card** com botões de ação
- **Quick info** com status da conta
- **Layout responsivo** mobile-friendly

## 🔐 Fluxo de Autenticação

1. **Usuário acessa** a aplicação
2. **Redirect automático** para login se não autenticado
3. **MSAL popup/redirect** para Microsoft
4. **Token JWT** obtido automaticamente
5. **Interceptor** adiciona token nas requisições API
6. **Guards** protegem rotas privadas
7. **Logout** limpa tokens e sessão

## 🎯 Integração com API .NET

A aplicação Angular consome a API .NET:

### Endpoints Utilizados
- `GET /api/auth/user` - Dados do usuário atual
- `GET /api/auth/status` - Status de autenticação
- `GET /api/tenant/info` - Informações do tenant
- `GET /api/tenant/users` - Lista de usuários
- `GET /api/tenant/groups` - Lista de grupos
- `GET /api/tenant/login-attempts` - Tentativas de login

### Headers Automáticos
```http
Authorization: Bearer <token-msal>
Content-Type: application/json
```

## 🚀 Deploy

### Azure Static Web Apps

```bash
# Build para produção
npm run build:prod

# Deploy manual
# Upload da pasta dist/ para Azure Static Web Apps
```

### Configuração no Azure
```json
{
  "routes": [
    {
      "route": "/auth/*",
      "allowedRoles": ["anonymous"]
    },
    {
      "route": "/*",
      "allowedRoles": ["authenticated"]
    }
  ],
  "responseOverrides": {
    "401": {
      "redirect": "/auth/login"
    }
  }
}
```

## 🔧 Customização

### Tema
```scss
// src/styles.scss
:root {
  --primary-color: #1976d2;
  --primary-50: #e3f2fd;
  --primary-100: #bbdefb;
  // ... mais cores
}
```

### Logo
```html
<!-- Substituir URL do logo -->
<img src="SUA-URL-DE-LOGO-AQUI" alt="Logo" />
```

### Configurações MSAL
```typescript
// Popup vs Redirect
interactionType: InteractionType.Popup  // ou Redirect

// Scopes adicionais
scopes: [
  'https://graph.microsoft.com/User.Read',
  'https://graph.microsoft.com/Directory.Read.All'
]
```

## 📊 Performance

### Bundle Size
- **Initial**: ~2MB (otimizado)
- **Lazy loaded**: ~200KB por rota
- **PrimeNG**: ~800KB (tree-shaken)
- **MSAL**: ~300KB

### Otimizações
- ✅ **Lazy loading** de rotas
- ✅ **OnPush** change detection
- ✅ **TrackBy** functions
- ✅ **Tree shaking** automático
- ✅ **Code splitting** por feature
- ✅ **Image optimization**

## 🐛 Troubleshooting

### Erro de CORS
```typescript
// API .NET - Program.cs
app.UseCors(options => {
    options.WithOrigins("http://localhost:4200")
           .AllowAnyMethod()
           .AllowAnyHeader();
});
```

### Erro de Token
```typescript
// Verificar configuração no environment.ts
clientId: 'correct-client-id',
authority: 'https://login.microsoftonline.com/correct-tenant-id'
```

### Erro de Redirect
```typescript
// Verificar redirect URI no Azure Portal
redirectUri: 'http://localhost:4200/auth/callback'
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # ng serve
npm run build         # ng build
npm run build:prod    # ng build --configuration production
npm test              # ng test
npm run lint          # ng lint

# Outros
npm run analyze       # webpack-bundle-analyzer
npm run update        # ng update
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── tenant.model.ts
│   │   │   └── api-response.model.ts
│   │   ├── services/
│   │   │   ├── msal.service.ts
│   │   │   └── tenant.service.ts
│   │   ├── interceptors/
│   │   │   └── msal.interceptor.ts
│   │   └── guards/
│   │       └── auth.guard.ts
│   ├── features/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── login.component.ts
│   │   │   └── callback/
│   │   │       └── callback.component.ts
│   │   ├── dashboard/
│   │   │   └── dashboard.component.ts
│   │   └── profile/
│   │       └── profile.component.ts
│   ├── shared/
│   │   ├── components/
│   │   │   └── header/
│   │   │       └── header.component.ts
│   │   └── layout/
│   │       └── main-layout.component.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
├── styles.scss
└── main.ts
```

## 🤝 Contribuição

1. Fork do projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🔗 Links Úteis

- [Angular Documentation](https://angular.io/docs)
- [PrimeNG Documentation](https://primeng.org/)
- [MSAL Angular Guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/tutorial-v2-angular-auth-code)
- [Azure AD App Registration](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)

---

**Desenvolvido usando Angular 17+ e PrimeNG md-light-indigo**