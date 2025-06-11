# 🔐 EntraId Web API

API REST .NET 8 com autenticação Azure Entra ID (Azure AD) para gerenciamento e monitoramento de informações de usuários, grupos e auditoria de tenants.

## 🚀 Funcionalidades

- ✅ **Autenticação JWT** com Azure Entra ID
- ✅ **Microsoft Graph Integration** para dados de usuários e organizações
- ✅ **Informações do usuário** autenticado via claims
- ✅ **Listagem de usuários** do tenant com paginação
- ✅ **Gerenciamento de grupos** com contagem de membros
- ✅ **Auditoria de logins** com tentativas recentes
- ✅ **Logging estruturado** com Serilog
- ✅ **Documentação Swagger** automática
- ✅ **Tratamento de erros** centralizado
- ✅ **Testes unitários** com xUnit e Moq
- ✅ **Docker support** para containerização

## 📁 Estrutura do Projeto

```
EntraIdWebApi/
├── src/
│   ├── EntraIdWebApi/
│   │   ├── Controllers/           # Controladores da API
│   │   │   ├── AuthController.cs
│   │   │   └── TenantController.cs
│   │   ├── Services/             # Serviços de negócio
│   │   │   ├── GraphService.cs
│   │   │   ├── UserService.cs
│   │   │   └── Interfaces/
│   │   ├── Models/               # DTOs e modelos
│   │   │   ├── DTOs/
│   │   │   └── Responses/
│   │   ├── Configuration/        # Configurações tipadas
│   │   ├── Extensions/           # Extensões e configurações
│   │   ├── Middleware/           # Middlewares customizados
│   │   ├── Program.cs            # Ponto de entrada e configuração
│   │   └── appsettings.json      # Configurações da aplicação
│   └── EntraIdWebApi.Tests/      # Testes unitários
│       └── UserServiceTests.cs
├── logs/                         # Diretório de logs (criado automaticamente)
├── Dockerfile                    # Container para deploy
├── EntraIdWebApi.sln            # Solution file
└── README.md                     # Esta documentação
```

## ⚙️ Tecnologias Utilizadas

### Framework e Runtime
- **.NET 8** - Framework principal
- **ASP.NET Core** - Web API framework
- **C# 12** - Linguagem de programação

### Autenticação e Segurança
- **Microsoft.Identity.Web** - Autenticação Azure AD
- **Microsoft.Graph** - API do Microsoft Graph
- **Azure.Identity** - Credenciais do Azure
- **JWT Bearer Authentication** - Validação de tokens

### Logging e Monitoramento
- **Serilog** - Logging estruturado
- **Serilog.Sinks.Console** - Output para console
- **Serilog.Sinks.File** - Output para arquivos

### Documentação e Testes
- **Swashbuckle.AspNetCore** - Documentação Swagger
- **xUnit** - Framework de testes
- **Moq** - Biblioteca de mocks

## 🔧 Configuração

### 1. Pré-requisitos

- **.NET 8 SDK** instalado
- **Azure Subscription** ativa
- **PowerShell** (para scripts opcionais)

### 2. Azure App Registration

#### Criar Aplicação no Azure AD
1. Acesse o [Azure Portal](https://portal.azure.com)
2. Navegue para **Azure Active Directory > App registrations**
3. Clique em **New registration**
4. Configure:
   - **Name**: `EntraId Web API`
   - **Supported account types**: `Accounts in this organizational directory only`
   - **Redirect URI**: Deixe em branco (é uma API)

#### Configurar Permissões
5. Vá para **API permissions** e adicione:
   - **Microsoft Graph API**:
     - `User.Read` (Delegated)
     - `Directory.Read.All` (Application)
     - `Group.Read.All` (Application)
     - `AuditLog.Read.All` (Application)

6. Clique em **Grant admin consent for [tenant]**

#### Obter Credenciais
7. Vá para **Overview** e anote:
   - **Application (client) ID**
   - **Directory (tenant) ID**

8. Vá para **Certificates & secrets** e crie um **New client secret**
   - Anote o **Value** do secret (só aparece uma vez)

### 3. Configurar appsettings.json

```json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "TenantId": "seu-tenant-id-aqui",
    "ClientId": "seu-client-id-aqui",
    "ClientSecret": "seu-client-secret-aqui",
    "Audience": "api://seu-client-id-aqui"
  },
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "System": "Warning"
      }
    }
  }
}
```

### 4. Executar a Aplicação

```bash
# Navegar para o diretório do projeto
cd src/EntraIdWebApi

# Restaurar dependências
dotnet restore

# Compilar
dotnet build

# Executar
dotnet run
```

A API estará disponível em:
- **HTTPS**: https://localhost:7001
- **HTTP**: http://localhost:7002
- **Swagger**: https://localhost:7001/swagger

## 🔗 Endpoints da API

### Autenticação (`/api/auth`)

#### `GET /api/auth/user`
Obtém informações do usuário autenticado via token MSAL.

**Headers:**
```http
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Informações do usuário obtidas com sucesso",
  "data": {
    "id": "user-id",
    "displayName": "João Silva",
    "email": "joao.silva@empresa.com",
    "tenantId": "tenant-id",
    "jobTitle": "Desenvolvedor",
    "department": "TI",
    "lastSignInDateTime": "2024-01-15T10:30:00Z"
  }
}
```

#### `GET /api/auth/status`
Verifica o status de autenticação e retorna claims do token.

**Response:**
```json
{
  "success": true,
  "data": {
    "isAuthenticated": true,
    "tokenType": "Bearer (MSAL)",
    "userId": "user-object-id",
    "tenantId": "tenant-id",
    "userEmail": "usuario@empresa.com",
    "claims": [...]
  }
}
```

### Tenant (`/api/tenant`)

#### `GET /api/tenant/info`
Obtém informações completas do tenant organizacional.

**Response:**
```json
{
  "success": true,
  "data": {
    "tenantId": "tenant-id",
    "displayName": "Empresa LTDA",
    "verifiedDomains": ["empresa.com", "empresa.onmicrosoft.com"],
    "totalUsers": 150,
    "totalGroups": 25,
    "recentUsers": [...],
    "groups": [...],
    "recentLoginAttempts": [...]
  }
}
```

#### `GET /api/tenant/users?top=50`
Lista usuários do tenant com paginação.

**Query Parameters:**
- `top` (optional): Número máximo de usuários (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user-id",
      "displayName": "Maria Santos",
      "email": "maria.santos@empresa.com",
      "tenantId": "tenant-id",
      "jobTitle": "Analista",
      "department": "Vendas",
      "lastSignInDateTime": "2024-01-15T09:15:00Z"
    }
  ]
}
```

#### `GET /api/tenant/groups?top=50`
Lista grupos do tenant com informações de membros.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "group-id",
      "displayName": "Desenvolvedores",
      "description": "Grupo dos desenvolvedores da empresa",
      "memberCount": 12,
      "createdDateTime": "2023-05-10T14:30:00Z"
    }
  ]
}
```

#### `GET /api/tenant/login-attempts?top=50`
Obtém tentativas de login recentes com detalhes de auditoria.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "userId": "user-id",
      "userDisplayName": "João Silva",
      "userPrincipalName": "joao.silva@empresa.com",
      "createdDateTime": "2024-01-15T10:45:00Z",
      "status": "Success",
      "ipAddress": "192.168.1.100",
      "location": "São Paulo, BR",
      "clientAppUsed": "Browser"
    }
  ]
}
```

## 🔐 Autenticação

### Fluxo de Autenticação
1. **Frontend** autentica usuário via MSAL
2. **MSAL** retorna token JWT válido
3. **Frontend** envia token no header `Authorization: Bearer <token>`
4. **API** valida token usando Microsoft signing keys
5. **API** extrai claims do usuário e processa requisição

### Configuração JWT
```csharp
// Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = $"{azureAdConfig.Instance}{azureAdConfig.TenantId}/v2.0";
        options.Audience = azureAdConfig.Audience;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.FromMinutes(5)
        };
    });
```

### Claims Utilizadas
- `oid` - Object ID do usuário
- `tid` - Tenant ID
- `preferred_username` - Email do usuário
- `name` - Nome do usuário
- `roles` - Roles do usuário (se configuradas)

## 🧪 Testes

### Executar Testes
```bash
cd src/EntraIdWebApi.Tests
dotnet test
```

### Estrutura dos Testes
```csharp
[Fact]
public async Task GetUserInfoAsync_ShouldReturnUserInfo_WhenGraphServiceReturnsUser()
{
    // Arrange
    var expectedUser = new UserInfoDto { /* ... */ };
    _mockGraphService.Setup(x => x.GetCurrentUserAsync())
                    .ReturnsAsync(expectedUser);

    // Act
    var result = await _userService.GetUserInfoAsync();

    // Assert
    Assert.NotNull(result);
    Assert.Equal(expectedUser.Id, result.Id);
}
```

### Cobertura de Testes
- ✅ Testes de serviços com mocks
- ✅ Testes de validação de dados
- ✅ Testes de autenticação
- ⏳ Testes de integração (em desenvolvimento)

## 📊 Logging

### Configuração Serilog
```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "System": "Warning"
      }
    },
    "WriteTo": [
      { "Name": "Console" },
      {
        "Name": "File",
        "Args": {
          "path": "logs/app-.txt",
          "rollingInterval": "Day"
        }
      }
    ]
  }
}
```

### Níveis de Log
- **Information**: Operações normais e fluxos principais
- **Warning**: Situações suspeitas ou degradação
- **Error**: Erros e exceções que precisam atenção
- **Debug**: Informações detalhadas para desenvolvimento

### Exemplos de Logs
```
2024-01-15 10:30:15 [INF] Requisição para obter informações do usuário autenticado via MSAL
2024-01-15 10:30:16 [INF] Token MSAL - UserId: abc123, Email: user@domain.com, TenantId: xyz789
2024-01-15 10:30:17 [INF] Informações do Graph para: user@domain.com
```

## 🐳 Docker

### Build da Imagem
```bash
docker build -t entraid-api .
```

### Executar Container
```bash
docker run -d \
  --name entraid-api \
  -p 80:80 \
  -p 443:443 \
  -e AZURE_TENANT_ID="seu-tenant-id" \
  -e AZURE_CLIENT_ID="seu-client-id" \
  -e AZURE_CLIENT_SECRET="seu-client-secret" \
  -e AZURE_AUDIENCE="api://seu-client-id" \
  entraid-api
```

### Variáveis de Ambiente
```bash
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_AUDIENCE=api://your-client-id
ASPNETCORE_ENVIRONMENT=Production
LOG_LEVEL=Information
```

## 🔧 Arquitetura e Padrões

### Dependency Injection
```csharp
// Extensions/ServiceCollectionExtensions.cs
services.AddScoped<IGraphService, GraphService>();
services.AddScoped<IUserService, UserService>();
services.AddHttpContextAccessor();
```

### Repository Pattern
- `IGraphService` - Interface para Microsoft Graph
- `GraphService` - Implementação com Azure.Identity
- `UserService` - Camada de negócio para usuários

### Response Pattern
```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public T? Data { get; set; }
    public List<string> Errors { get; set; }
}
```

### Error Handling
```csharp
// Middleware/ErrorHandlingMiddleware.cs
public async Task InvokeAsync(HttpContext context)
{
    try
    {
        await _next(context);
    }
    catch (Exception ex)
    {
        await HandleExceptionAsync(context, ex);
    }
}
```

## 🚀 Deploy

### Azure App Service
1. **Criar App Service** no Azure
2. **Configurar variáveis** de ambiente:
   ```
   AzureAd__TenantId = your-tenant-id
   AzureAd__ClientId = your-client-id
   AzureAd__ClientSecret = your-client-secret
   ```
3. **Deploy** via GitHub Actions ou VS Code
4. **Configurar HTTPS** obrigatório

### IIS (On-Premises)
1. **Instalar .NET 8 Runtime** no servidor
2. **Publicar aplicação**:
   ```bash
   dotnet publish -c Release -o ./publish
   ```
3. **Configurar IIS** com ASP.NET Core Module
4. **Configurar variáveis** de ambiente

### Docker Swarm/Kubernetes
```yaml
# docker-compose.yml
version: '3.8'
services:
  entraid-api:
    image: entraid-api:latest
    ports:
      - "80:80"
      - "443:443"
    environment:
      - AZURE_TENANT_ID=${AZURE_TENANT_ID}
      - AZURE_CLIENT_ID=${AZURE_CLIENT_ID}
      - AZURE_CLIENT_SECRET=${AZURE_CLIENT_SECRET}
```

## 🔍 Troubleshooting

### Problemas Comuns

**Erro: "Invalid audience"**
```
Solução: Verificar se Audience no appsettings.json está correto
Formato: api://your-client-id
```

**Erro: "Invalid issuer"**
```
Solução: Confirmar TenantId no appsettings.json
Verificar se está no formato: seu-tenant-id (sem https://)
```

**Erro: "Insufficient privileges"**
```
Solução: Verificar permissões no Azure AD:
1. API permissions configuradas
2. Admin consent concedido
3. Usuário tem acesso ao tenant
```

**Erro: "Token expired"**
```
Solução: Frontend deve renovar token automaticamente
ClockSkew configurado para 5 minutos de tolerância
```

### Logs de Debug
```bash
# Ativar logs detalhados
export ASPNETCORE_ENVIRONMENT=Development
export Logging__LogLevel__Default=Debug
```

### Health Check
```bash
# Verificar se API está rodando
curl https://localhost:7001/debug/auth
```

## 📈 Performance

### Otimizações Implementadas
- ✅ **Connection pooling** para Microsoft Graph
- ✅ **Token caching** automático via Azure.Identity
- ✅ **Compression** GZIP habilitada
- ✅ **Response caching** para dados estáticos

### Métricas Recomendadas
- **Response time** < 500ms para a maioria das chamadas
- **Memory usage** < 100MB em idle
- **CPU usage** < 10% em idle
- **Error rate** < 1%

## 🤝 Contribuição

### Padrões de Código
- **C# Coding Conventions** da Microsoft
- **XML Documentation** em APIs públicas
- **Unit tests** para nova funcionalidade
- **Integration tests** para controladores

### Pull Request Process
1. **Fork** o repositório
2. **Criar branch** descritiva
3. **Implementar** com testes
4. **Atualizar** documentação
5. **Abrir PR** com descrição detalhada

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.

---

**Desenvolvido usando .NET 8 e Azure Entra ID**