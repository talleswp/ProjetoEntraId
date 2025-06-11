# 🎨 EntraId Angular Dashboard

Dashboard moderno e responsivo em Angular 17+ com PrimeNG 17+ e autenticação MSAL para gerenciamento visual do Azure Active Directory (Entra ID).

## 🚀 Funcionalidades

- ✅ **Autenticação MSAL** com popup/redirect Microsoft
- ✅ **Dashboard interativo** com métricas em tempo real
- ✅ **Gestão de usuários** com avatars e informações detalhadas
- ✅ **Visualização de grupos** com paginação e filtros
- ✅ **Auditoria de logins** com status e localização
- ✅ **Interface responsiva** mobile-first
- ✅ **Tema lara-light-blue** do PrimeNG
- ✅ **Standalone Components** Angular 17+
- ✅ **Signal-based** state management
- ✅ **Lazy loading** de rotas otimizado
- ✅ **TypeScript strict** mode

## 🎨 Design System

### Tema e Visual
- **PrimeNG lara-light-blue** - Componentes UI modernos
- **Logo Azure Brasil** personalizado
- **Gradientes animados** na tela de login
- **Dark mode** automático baseado no sistema
- **Animações suaves** e micro-interações
- **Tipografia** moderna com hierarquia visual clara

### Responsividade
- **Mobile-first** approach
- **Breakpoints** otimizados para tablets e desktop
- **Grid system** flexível do PrimeFlex
- **Componentes adaptativos** que se ajustam ao contexto

## 📁 Estrutura do Projeto

```
entra-id-angular-app/
├── src/
│   ├── app/
│   │   ├── core/                     # Núcleo da aplicação
│   │   │   ├── models/               # Interfaces TypeScript
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── tenant.model.ts
│   │   │   │   └── api-response.model.ts
│   │   │   ├── services/             # Serviços de negócio
│   │   │   │   ├── msal.service.ts
│   │   │   │   └── tenant.service.ts
│   │   │   ├── guards/               # Guards de rota
│   │   │   │   └── auth.guard.ts
│   │   │   └── interceptors/         # HTTP interceptors
│   │   │       └── msal.interceptor.ts
│   │   ├── features/                 # Funcionalidades por domínio
│   │   │   ├── auth/                 # Autenticação
│   │   │   │   ├── login/
│   │   │   │   │   ├── login.component.ts
│   │   │   │   │   ├── login.component.html
│   │   │   │   │   └── login.component.scss
│   │   │   │   └── callback/
│   │   │   │       └── callback.component.ts
│   │   │   ├── dashboard/            # Dashboard principal
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   ├── dashboard.component.html
│   │   │   │   └── dashboard.component.scss
│   │   │   └── profile/              # Perfil do usuário
│   │   │       ├── profile.component.ts
│   │   │       ├── profile.component.html
│   │   │       └── profile.component.scss
│   │   ├── shared/                   # Componentes compartilhados
│   │   │   ├── components/
│   │   │   │   └── header/
│   │   │   │       ├── header.component.ts
│   │   │   │       ├── header.component.html
│   │   │   │       └── header.component.scss
│   │   │   └── layout/
│   │   │       └── main-layout.component.ts
│   │   ├── app.component.ts          # Componente raiz
│   │   ├── app.config.ts             # Configuração da aplicação
│   │   └── app.routes.ts             # Definição de rotas
│   ├── environments/                 # Configurações de ambiente
│   │   ├── environment.ts            # Desenvolvimento
│   │   ├── environment.prod.ts       # Produção
│   │   └── environment.template.ts   # Template para CI/CD
│   ├── assets/                       # Recursos estáticos
│   │   └── images/
│   ├── styles.scss                   # Estilos globais
│   ├── main.ts                       # Bootstrap da aplicação
│   └── index.html                    # HTML principal
├── angular.json                      # Configuração do Angular CLI
├── package.json                      # Dependências e scripts
├── tsconfig.json                     # Configuração TypeScript
├── Dockerfile                        # Container para deploy
└── README.md                         # Esta documentação
```

## ⚙️ Tecnologias Utilizadas

### Framework e Linguagem
- **Angular 17+** - Framework principal com standalone components
- **TypeScript 5.4+** - Linguagem com strict mode
- **RxJS** - Programação reativa com Signals
- **Zone.js** - Change detection

### UI/UX e Styling
- **PrimeNG 17+** - Biblioteca de componentes UI
- **PrimeIcons** - Ícones vetoriais
- **PrimeFlex** - CSS utilities e grid system
- **SCSS** - Pré-processador CSS com variáveis customizadas

### Autenticação e HTTP
- **MSAL Angular** - Microsoft Authentication Library
- **@azure/msal-browser** - MSAL core para browser
- **HTTP Client** - Comunicação com APIs REST

### Build e Desenvolvimento
- **Angular CLI** - Ferramentas de desenvolvimento
- **Webpack** - Bundling automático com tree shaking
- **ESLint** - Linting e qualidade de código
- **Karma + Jasmine** - Testes unitários

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

### 2. Instalação

```bash
# Clonar o repositório
git clone <repository-url>
cd entra-id-angular-app

# Instalar dependências
npm install
```

### 3. Azure App Registration

#### Configurar SPA no Azure AD
1. **Azure Portal** → Azure Active Directory → App registrations
2. **New registration** ou usar existente:
   - Name: `EntraId Angular App`
   - Account types: `Single tenant`
   - Redirect URI: `Single-page application (SPA)` → `http://localhost:4200/auth/callback`

3. **Authentication** settings:
   - Add redirect URI: `http://localhost:4200`
   - Enable `Access tokens` and `ID tokens`
   - Configure logout URL: `http://localhost:4200`

4. **API permissions**:
   - Microsoft Graph → Delegated permissions:
     - `User.Read`
     - `Directory.Read.All`
     - `Group.Read.All`
     - `AuditLog.Read.All` (se disponível)
   - Grant admin consent

### 4. Configurar Environment

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001/api',
  appName: 'EntraId Dashboard',
  
  msalConfig: {
    auth: {
      clientId: 'SEU-CLIENT-ID-AQUI',           // Application (client) ID
      authority: 'https://login.microsoftonline.com/SEU-TENANT-ID-AQUI/v2.0', // Directory (tenant) ID
      redirectUri: 'http://localhost:4200/auth/callback',
      postLogoutRedirectUri: 'http://localhost:4200'
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false
    }
  },
  
  apiConfig: {
    scopes: ['api://SEU-CLIENT-ID-DA-API/access_as_user'],
    uri: 'https://localhost:7001/api'
  }
};
```

### 5. Executar Aplicação

```bash
# Desenvolvimento
npm start
# ou
ng serve

# Build para produção
npm run build:prod
# ou
ng build --configuration production

# Testes
npm test
# ou
ng test

# Lint
npm run lint
# ou
ng lint
```

## 🌐 URLs e Navegação

### URLs Disponíveis
- **Desenvolvimento**: http://localhost:4200
- **Login**: http://localhost:4200/auth/login
- **Dashboard**: http://localhost:4200/dashboard
- **Perfil**: http://localhost:4200/profile

### Roteamento
```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component') },
      { path: 'callback', loadComponent: () => import('./features/auth/callback/callback.component') }
    ]
  },
  {
    path: '',
    loadComponent: () => import('./shared/layout/main-layout.component'),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component') },
      { path: 'profile', loadComponent: () => import('./features/profile/profile.component') }
    ]
  }
];
```

## 🔐 Autenticação MSAL

### Fluxo de Autenticação
1. **Usuário acessa** aplicação
2. **AuthGuard** verifica autenticação
3. **Redirect** para login se não autenticado
4. **MSAL popup/redirect** para Microsoft
5. **Token recebido** e armazenado
6. **Interceptor** adiciona token automaticamente
7. **Navegação** para dashboard

### Configuração MSAL
```typescript
// app.config.ts
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.msalConfig.auth.clientId,
      authority: environment.msalConfig.auth.authority,
      redirectUri: environment.msalConfig.auth.redirectUri,
      navigateToLoginRequestUrl: false
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: false
    },
    system: {
      loggerOptions: {
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false
      }
    }
  });
}
```

### Serviço de Autenticação
```typescript
// core/services/msal.service.ts
@Injectable({ providedIn: 'root' })
export class MsalAuthService {
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  login(): Observable<AuthenticationResult> {
    const request: PopupRequest = {
      scopes: environment.apiConfig.scopes,
      prompt: 'select_account'
    };
    
    return this.msalService.loginPopup(request);
  }

  getAccessToken(): Observable<string> {
    const account = this.msalService.instance.getActiveAccount();
    const request: SilentRequest = {
      scopes: environment.apiConfig.scopes,
      account: account!
    };
    
    return this.msalService.acquireTokenSilent(request);
  }
}
```

## 📱 Interface e Componentes

### Tela de Login
- **Design moderno** com gradientes animados
- **Logo Azure Brasil** personalizado
- **Botão Microsoft** estilizado
- **Loading states** durante autenticação
- **Informações de segurança** visuais
- **Layout responsivo** mobile-friendly

```html
<!-- login.component.html (resumido) -->
<div class="login-container">
  <div class="animated-background">
    <div class="gradient-orb orb-1"></div>
    <div class="gradient-orb orb-2"></div>
  </div>
  
  <div class="login-card">
    <div class="logo-container">
      <img src="https://www.azurebrasil.cloud/content/images/2025/01/Group-310.svg" alt="Logo" />
      <h1>EntraId Dashboard</h1>
    </div>
    
    <p-button 
      label="Entrar com Microsoft"
      (onClick)="login()"
      [loading]="loading">
    </p-button>
  </div>
</div>
```

### Dashboard Principal
- **Cartões de métricas** com ícones coloridos
- **Tabelas responsivas** com paginação
- **Avatars personalizados** com iniciais
- **Tags de status** coloridas
- **Refresh automático** de dados

```typescript
// dashboard.component.ts (resumido)
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, TagModule, AvatarModule]
})
export class DashboardComponent {
  currentUser = signal(this.msalAuthService.getCurrentAccount());
  tenantInfo = signal<TenantInfo | null>(null);
  tenantUsers = signal<UserInfo[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadDashboardData();
  }
}
```

### Header de Navegação
- **Brand section** com logo e título
- **Menu central** com navegação ativa
- **User section** com avatar e informações
- **Logout button** com confirmação

### Perfil do Usuário
- **Card principal** com informações detalhadas
- **Actions card** com botões de ação
- **Quick info** com status da conta
- **Layout grid** responsivo

## 🎯 State Management

### Signal-based Architecture
```typescript
// Uso de Signals para estado reativo
export class DashboardComponent {
  // Signals para dados
  currentUser = signal(this.msalAuthService.getCurrentAccount());
  tenantInfo = signal<TenantInfo | null>(null);
  loading = signal(false);
  
  // Computed signals
  userInitials = computed(() => 
    this.getInitials(this.currentUser()?.name || '')
  );
  
  // Effects para side effects
  constructor() {
    effect(() => {
      if (this.currentUser()) {
        this.loadUserData();
      }
    });
  }
}
```

### Services com Observables
```typescript
// core/services/tenant.service.ts
@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly http = inject(HttpClient);

  getTenantInfo(): Observable<ApiResponse<TenantInfo>> {
    return this.http.get<ApiResponse<TenantInfo>>(`${environment.apiUrl}/tenant/info`);
  }
  
  getCurrentUser(): Observable<ApiResponse<UserInfo>> {
    return this.http.get<ApiResponse<UserInfo>>(`${environment.apiUrl}/auth/user`);
  }
}
```

## 🧪 Testes

### Estrutura de Testes
```bash
# Executar todos os testes
npm test

# Testes com coverage
npm run test:coverage

# Testes em modo watch
ng test --watch

# Testes headless para CI
ng test --browsers=ChromeHeadless --watch=false
```

### Exemplo de Teste
```typescript
// login.component.spec.ts
describe('LoginComponent', () => {
  let component: LoginComponent;
  let msalAuthService: jasmine.SpyObj<MsalAuthService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MsalAuthService', ['login', 'isAuthenticated']);
    
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: MsalAuthService, useValue: spy }
      ]
    }).compileComponents();
    
    msalAuthService = TestBed.inject(MsalAuthService) as jasmine.SpyObj<MsalAuthService>;
  });

  it('should login successfully', () => {
    msalAuthService.login.and.returnValue(of(mockAuthResult));
    component.login();
    expect(msalAuthService.login).toHaveBeenCalled();
  });
});
```

## 🎨 Customização de Tema

### Variáveis CSS Customizadas
```scss
// styles.scss
:root {
  // Cores primárias
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  
  // Gradientes
  --gradient-primary: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  
  // Sombras
  --shadow-light: 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-medium: 0 8px 25px rgba(0, 0, 0, 0.15);
}
```

### Componentes PrimeNG Customizados
```scss
// Botões com gradiente
.p-button:not(.p-button-outlined) {
  background: var(--gradient-primary) !important;
  border: none !important;
  box-shadow: var(--shadow-light) !important;
  
  &:hover {
    transform: translateY(-1px) !important;
    box-shadow: var(--shadow-medium) !important;
  }
}

// Cards com sombra suave
.p-card {
  border-radius: 12px !important;
  box-shadow: var(--shadow-medium) !important;
  border: none !important;
}
```

## 🐳 Docker

### Build da Imagem
```bash
# Build para produção
npm run build:prod

# Build da imagem Docker
docker build -t entraid-frontend .
```

### Multi-stage Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build:prod

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist/entra-id-angular-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Variáveis de Ambiente
```bash
# Usar environment template
AZURE_CLIENT_ID=your-client-id
AZURE_TENANT_ID=your-tenant-id
API_URL=https://api.yourdomain.com/api
REDIRECT_URI=https://yourdomain.com/auth/callback
```

## 📊 Performance

### Bundle Size Otimizado
- **Initial Bundle**: ~2MB (com PrimeNG tree-shaken)
- **Lazy Loaded Routes**: ~200KB por rota
- **Vendor Bundle**: Separado automaticamente
- **Assets**: Compressão GZIP habilitada

### Otimizações Implementadas
```typescript
// Lazy loading de rotas
{
  path: 'dashboard',
  loadComponent: () => import('./features/dashboard/dashboard.component')
    .then(c => c.DashboardComponent)
}

// OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// TrackBy functions para listas
trackByUser(index: number, user: UserInfo): string {
  return user.id;
}
```

### Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FCP (First Contentful Paint)**: < 1.8s

## 🚀 Deploy

### Azure Static Web Apps
```yaml
# .github/workflows/azure-static-web-apps.yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches: [ main ]

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Build And Deploy
      uses: Azure/static-web-apps-deploy@v1
      with:
        azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
        app_location: "/"
        api_location: ""
        output_location: "dist/entra-id-angular-app"
```

### Nginx Configuration
```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle Angular routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

### Environment Substitution
```bash
# scripts/substitute-env.sh
#!/bin/bash
envsubst < src/environments/environment.template.ts > src/environments/environment.prod.ts
```

## 🔍 Troubleshooting

### Problemas Comuns

**Erro: "MSAL interaction in progress"**
```typescript
// Aguardar finalização de interações MSAL
this.msalBroadcastService.inProgress$
  .pipe(filter(status => status === InteractionStatus.None))
  .subscribe(() => {
    // Prosseguir com operação
  });
```

**Erro: "Token acquisition failed"**
```typescript
// Verificar configuração no environment.ts
clientId: 'correct-client-id',
authority: 'https://login.microsoftonline.com/correct-tenant-id/v2.0'
```

**Erro: "CORS policy"**
```typescript
// Verificar se API permite origem do frontend
// Backend deve ter CORS configurado para http://localhost:4200
```

**Problema: "Route não carrega"**
```typescript
// Verificar se AuthGuard está funcionando
// Verificar se usuário está autenticado
// Verificar console para erros de JavaScript
```

### Debug Mode
```typescript
// Ativar logs detalhados MSAL
system: {
  loggerOptions: {
    logLevel: LogLevel.Verbose,
    piiLoggingEnabled: true // Apenas desenvolvimento
  }
}
```

## 📈 Roadmap

### Próximas Funcionalidades
- [ ] **Modo escuro** completo
- [ ] **PWA support** com service workers
- [ ] **Notificações push** para eventos importantes
- [ ] **Filtros avançados** nas tabelas
- [ ] **Export de dados** para Excel/PDF
- [ ] **Configurações** personalizáveis do usuário
- [ ] **Métricas avançadas** com gráficos
- [ ] **Chat support** integrado

### Melhorias Técnicas
- [ ] **Micro-frontends** para escalabilidade
- [ ] **GraphQL** integration
- [ ] **Web Components** para reutilização
- [ ] **Cypress** para testes E2E
- [ ] **Storybook** para documentação de componentes

## 🤝 Contribuição

### Padrões de Desenvolvimento
```bash
# Convenção de commits
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: mudanças de formatação
refactor: refatoração de código
test: adiciona ou modifica testes
```

### Setup para Contribuição
1. **Fork** o repositório
2. **Clone** localmente
3. **Criar branch** descritiva: `git checkout -b feature/nova-funcionalidade`
4. **Implementar** com testes
5. **Commit** seguindo convenções
6. **Push** para seu fork
7. **Abrir PR** com descrição detalhada

### Code Review Checklist
- [ ] Código segue padrões TypeScript
- [ ] Componentes são standalone
- [ ] Testes unitários incluídos
- [ ] Documentação atualizada
- [ ] Performance não degradada
- [ ] Acessibilidade considerada

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.

## 🔗 Links Úteis

- [Angular Documentation](https://angular.io/docs)
- [PrimeNG Components](https://primeng.org/)
- [MSAL Angular Guide](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular)
- [Azure AD App Registration](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)

---

**Desenvolvido usando Angular 17+, PrimeNG e Azure Entra ID**