# EntraId Web API

API .NET 8 com autenticação Azure Entra ID (Azure AD) para obter informações de usuários e tenants.

## 🚀 Funcionalidades

- ✅ Autenticação com Azure Entra ID
- ✅ Obtenção de informações do usuário autenticado
- ✅ Informações detalhadas do tenant
- ✅ Lista de usuários do tenant
- ✅ Lista de grupos do tenant
- ✅ Tentativas de login recentes
- ✅ Logging estruturado com Serilog
- ✅ Tratamento de erros centralizado
- ✅ Documentação Swagger
- ✅ Testes unitários

## 📁 Estrutura do Projeto

`
EntraIdWebApi/
├── src/
│   ├── EntraIdWebApi/
│   │   ├── Controllers/           # Controladores da API
│   │   ├── Services/             # Serviços de negócio
│   │   ├── Models/               # DTOs e modelos
│   │   ├── Configuration/        # Configurações
│   │   ├── Extensions/           # Extensões
│   │   ├── Middleware/           # Middlewares
│   │   └── Program.cs            # Ponto de entrada
│   └── EntraIdWebApi.Tests/      # Testes unitários
├── logs/                         # Diretório de logs
└── README.md
`

## ⚙️ Configuração

### 1. Pré-requisitos

- .NET 8 SDK
- Azure Subscription
- PowerShell (para executar o script de criação)

### 2. Configurar Azure App Registration

1. Acesse o [Azure Portal](https://portal.azure.com)
2. Navegue para **Azure Active Directory > App registrations**
3. Clique em **New registration**
4. Configure:
   - **Name**: EntraId Web API
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: Deixe em branco para APIs

5. Após criar, vá para **API permissions** e adicione:
   - **Microsoft Graph API**:
     - User.Read (Delegated)
     - Directory.Read.All (Application)
     - Group.Read.All (Application)
     - AuditLog.Read.All (Application)

6. Vá para **Certificates & secrets** e crie um **Client secret**

7. Anote os seguintes valores:
   - **Application (client) ID**
   - **Directory (tenant) ID**
   - **Client secret value**

### 3. Configurar appsettings.json

Edite o arquivo src/EntraIdWebApi/appsettings.json:

`json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "your-domain.onmicrosoft.com",
    "TenantId": "seu-tenant-id-aqui",
    "ClientId": "seu-client-id-aqui",
    "ClientSecret": "seu-client-secret-aqui"
  }
}
`

### 4. Executar a aplicação

`ash
cd src/EntraIdWebApi
dotnet restore
dotnet build
dotnet run
`

A aplicação estará disponível em:
- **HTTPS**: https://localhost:7xxx
- **HTTP**: http://localhost:5xxx
- **Swagger**: https://localhost:7xxx/swagger

## 🔗 Endpoints da API

### Autenticação
- GET /api/auth/user - Informações do usuário autenticado
- GET /api/auth/status - Status de autenticação

### Tenant
- GET /api/tenant/info - Informações completas do tenant
- GET /api/tenant/users?top=50 - Usuários do tenant
- GET /api/tenant/groups?top=50 - Grupos do tenant
- GET /api/tenant/login-attempts?top=50 - Tentativas de login recentes

## 🔐 Autenticação

Para usar a API, você precisa de um token JWT válido do Azure AD. 

### Exemplo usando cURL:

`ash
# 1. Obter token (substitua pelos seus valores)
curl -X POST https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id={client-id}&client_secret={client-secret}&scope=https://graph.microsoft.com/.default&grant_type=client_credentials"

# 2. Usar o token para chamar a API
curl -X GET https://localhost:7xxx/api/auth/user \
  -H "Authorization: Bearer {seu-token-aqui}"
`

## 🧪 Executar Testes

`ash
cd src/EntraIdWebApi.Tests
dotnet test
`

## 📊 Logs

Os logs são salvos em:
- **Console**: Durante desenvolvimento
- **Arquivo**: logs/app-YYYY-MM-DD.txt

Níveis de log configurados:
- **Information**: Para operações normais
- **Warning**: Para situações suspeitas
- **Error**: Para erros e exceções
- **Debug**: Apenas em desenvolvimento

## 🏗️ Arquitetura

### Padrões Implementados

- **Repository Pattern**: Através do GraphService
- **Dependency Injection**: Interfaces e implementações
- **Response Pattern**: Respostas padronizadas
- **Middleware Pattern**: Tratamento global de erros
- **Configuration Pattern**: Configurações tipadas

### Princípios SOLID

- **S**ingle Responsibility: Cada classe tem uma responsabilidade
- **O**pen/Closed: Extensível através de interfaces
- **L**iskov Substitution: Implementações substituíveis
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Dependências por abstração

## 🛠️ Tecnologias Utilizadas

- **.NET 8**: Framework principal
- **Microsoft.Identity.Web**: Autenticação Azure AD
- **Microsoft.Graph**: Integração com Microsoft Graph
- **Serilog**: Logging estruturado
- **Swagger**: Documentação da API
- **xUnit**: Framework de testes
- **Moq**: Biblioteca de mocks

## 🚀 Deploy

### Azure App Service

1. Publique a aplicação:
`ash
dotnet publish -c Release -o ./publish
`

2. Configure as variáveis de ambiente no Azure:
- AzureAd__TenantId
- AzureAd__ClientId
- AzureAd__ClientSecret

### Docker (Opcional)

Crie um Dockerfile:

`dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["EntraIdWebApi/EntraIdWebApi.csproj", "EntraIdWebApi/"]
RUN dotnet restore "EntraIdWebApi/EntraIdWebApi.csproj"
COPY . .
WORKDIR "/src/EntraIdWebApi"
RUN dotnet build "EntraIdWebApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "EntraIdWebApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EntraIdWebApi.dll"]
`

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique os logs da aplicação
2. Confirme as permissões no Azure AD
3. Valide as configurações no appsettings.json
4. Teste a conectividade com o Microsoft Graph

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Criado com ❤️ usando .NET 8 e Azure Entra ID**
