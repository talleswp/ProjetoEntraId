# 🚀 EntraId Management Solution

Uma solução completa para gerenciamento e monitoramento do Azure Active Directory (Entra ID), composta por uma API .NET 8 e um dashboard Angular 17+ moderno.

## 📋 Visão Geral

Este projeto oferece uma interface intuitiva para:
- ✅ Autenticação com Azure Entra ID (Azure AD)
- ✅ Visualização de informações de usuários e organizações
- ✅ Monitoramento de tentativas de login
- ✅ Gerenciamento de grupos e permissões
- ✅ Dashboard com métricas em tempo real
- ✅ Interface moderna e responsiva

## 🏗️ Arquitetura

```
EntraId Management Solution/
├── EntraIdWebApi/              # Backend - API .NET 8
│   ├── src/
│   │   ├── EntraIdWebApi/      # Projeto principal da API
│   │   └── EntraIdWebApi.Tests/ # Testes unitários
│   ├── Dockerfile              # Container da API
│   └── README.md
│
├── entra-id-angular-app/       # Frontend - Angular 17+
│   ├── src/
│   │   ├── app/                # Aplicação Angular
│   │   └── environments/       # Configurações de ambiente
│   ├── Dockerfile              # Container do frontend
│   └── README.md
│
└── README.md                   # Este arquivo
```

## 🔧 Tecnologias Utilizadas

### Backend (EntraIdWebApi)
- **.NET 8** - Framework principal
- **Microsoft.Identity.Web** - Autenticação Azure AD
- **Microsoft.Graph** - Integração com Microsoft Graph API
- **Azure.Identity** - Autenticação de aplicação
- **Serilog** - Logging estruturado
- **Swagger** - Documentação da API
- **xUnit + Moq** - Testes unitários

### Frontend (entra-id-angular-app)
- **Angular 17+** - Framework com standalone components
- **PrimeNG 17+** - Biblioteca de componentes UI
- **MSAL Angular** - Autenticação Microsoft
- **TypeScript 5.4+** - Linguagem principal
- **RxJS Signals** - Gerenciamento de estado reativo
- **SCSS** - Pré-processador CSS

## 🚀 Início Rápido

### Pré-requisitos
- **Node.js 18+** e **npm**
- **.NET 8 SDK**
- **Azure Subscription** com Azure AD/Entra ID
- **PowerShell** (para scripts de configuração)

### 1. Configuração do Azure AD

#### Criar App Registration
1. Acesse o [Azure Portal](https://portal.azure.com)
2. Navegue para **Azure Active Directory > App registrations**
3. Clique em **New registration**
4. Configure:
   - **Name**: `EntraId Management Solution`
   - **Account types**: `Single tenant`
   - **Redirect URI**: 
     - SPA: `http://localhost:4200/auth/callback`
     - Web: `https://localhost:7001/signin-oidc`

#### Configurar Permissões
5. Em **API permissions**, adicione:
   - **Microsoft Graph (Delegated)**:
     - `User.Read`
     - `Directory.Read.All`
     - `Group.Read.All`
   - **Microsoft Graph (Application)**:
     - `Directory.Read.All`
     - `Group.Read.All`
     - `AuditLog.Read.All`

6. **Grant admin consent** para todas as permissões

#### Obter Credenciais
7. Anote:
   - **Application (client) ID**
   - **Directory (tenant) ID**
8. Em **Certificates & secrets**, crie um **Client secret**

### 2. Configuração e Execução

#### Backend (API .NET 8)
```bash
cd EntraIdWebApi

# Configurar appsettings.json
cp src/EntraIdWebApi/appsettings.template.json src/EntraIdWebApi/appsettings.json
# Editar com suas credenciais Azure

# Restaurar dependências
dotnet restore

# Executar a API
dotnet run --project src/EntraIdWebApi
```

A API estará disponível em:
- **HTTPS**: https://localhost:7001
- **Swagger**: https://localhost:7001/swagger

#### Frontend (Angular Dashboard)
```bash
cd entra-id-angular-app

# Instalar dependências
npm install

# Configurar environment
# Editar src/environments/environment.ts com suas credenciais

# Executar o dashboard
npm start
```

O dashboard estará disponível em:
- **URL**: http://localhost:4200

### 3. Acesso à Aplicação

1. Acesse http://localhost:4200
2. Clique em **"Entrar com Microsoft"**
3. Faça login com sua conta Azure AD
4. Explore o dashboard com informações do tenant

## 📊 Funcionalidades

### Dashboard Principal
- **Métricas em tempo real** do tenant
- **Informações do usuário** atual
- **Contadores** de usuários e grupos
- **Tentativas de login** recentes

### Gestão de Usuários
- **Lista completa** de usuários do tenant
- **Detalhes** como cargo, departamento, último login
- **Avatars** com iniciais personalizadas

### Gestão de Grupos
- **Visualização de grupos** com contagem de membros
- **Descrições** e datas de criação
- **Paginação** para grandes volumes

### Auditoria e Segurança
- **Tentativas de login** com status de sucesso/falha
- **Informações de localização** e IP
- **Aplicativos** utilizados para login

## 🔐 Segurança

### Autenticação
- **Azure Entra ID** como provedor principal
- **Multi-Factor Authentication** suportado
- **Tokens JWT** validados pelo backend
- **Refresh automático** de tokens

### Autorização
- **Claims-based authorization** no backend
- **Route guards** no frontend
- **Interceptors** para injeção automática de tokens
- **Logout seguro** com limpeza de sessão

## 🐳 Docker

### Executar com Docker Compose
```bash
# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Executar ambos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f
```

### Build Individual
```bash
# Backend
cd EntraIdWebApi
docker build -t entraid-api .

# Frontend
cd entra-id-angular-app
docker build -t entraid-frontend .
```

## 🧪 Testes

### Backend
```bash
cd EntraIdWebApi
dotnet test src/EntraIdWebApi.Tests/
```

### Frontend
```bash
cd entra-id-angular-app
npm test
```

## 📈 Deploy

### Azure App Service
1. **Backend**: Deploy da API para Azure App Service
2. **Frontend**: Deploy para Azure Static Web Apps
3. **Configurar** variáveis de ambiente no Azure
4. **Atualizar** redirect URIs no Azure AD

### On-Premises
1. **IIS** para o backend .NET
2. **Nginx/Apache** para o frontend Angular
3. **HTTPS** obrigatório para produção
4. **Variáveis de ambiente** configuradas

## 🔧 Configuração Avançada

### Logging
- **Serilog** no backend com múltiplos sinks
- **Console logging** no frontend para desenvolvimento
- **Structured logging** com níveis configuráveis

### Performance
- **Lazy loading** de rotas no Angular
- **Caching** de tokens MSAL
- **Compressão GZIP** no backend
- **Tree shaking** automático no build

### Monitoramento
- **Application Insights** (opcional)
- **Health checks** na API
- **Error tracking** centralizado

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

### Problemas Comuns

**Erro de CORS**
```typescript
// API Program.cs
app.UseCors(policy => policy
    .WithOrigins("http://localhost:4200")
    .AllowAnyMethod()
    .AllowAnyHeader());
```

**Token inválido**
- Verificar `clientId` e `tenantId` no environment
- Confirmar redirect URI no Azure Portal
- Verificar permissões concedidas

**Falha na autenticação**
- Verificar se o usuário tem acesso ao tenant
- Confirmar que o MFA está configurado
- Testar com usuário administrador

### Links Úteis
- [Documentação Azure AD](https://docs.microsoft.com/en-us/azure/active-directory/)
- [MSAL Angular Guide](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular)
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/)
- [Angular Documentation](https://angular.io/docs)
- [PrimeNG Components](https://primeng.org/)

---

**Desenvolvido usando .NET 8, Angular 17+ e Azure Entra ID**