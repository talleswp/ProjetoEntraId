# Create-Angular-Project-Structure.ps1
# Script PowerShell para criar a estrutura completa do projeto Angular EntraId

param(
    [Parameter(Mandatory=$false)]
    [string]$ProjectPath = ".\entra-id-angular-app",
    
    [Parameter(Mandatory=$false)]
    [switch]$Force,
    
    [Parameter(Mandatory=$false)]
    [switch]$CreateAngularProject
)

# Função para criar diretório se não existir
function New-DirectoryIfNotExists {
    param([string]$Path)
    
    if (!(Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
        Write-Host "✅ Criado diretório: $Path" -ForegroundColor Green
    } else {
        Write-Host "📁 Diretório já existe: $Path" -ForegroundColor Yellow
    }
}

# Função para criar arquivo vazio
function New-EmptyFile {
    param(
        [string]$FilePath,
        [string]$Description = ""
    )
    
    $directory = Split-Path $FilePath -Parent
    New-DirectoryIfNotExists -Path $directory
    
    if ($Force -or !(Test-Path $FilePath)) {
        New-Item -ItemType File -Path $FilePath -Force | Out-Null
        Write-Host "📄 Criado arquivo: $FilePath" -ForegroundColor Cyan
        if ($Description) {
            Write-Host "   └─ $Description" -ForegroundColor Gray
        }
    } else {
        Write-Host "⚠️  Arquivo já existe: $FilePath" -ForegroundColor Yellow
    }
}

# Banner inicial
Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║                  ANGULAR ENTRA ID PROJECT                   ║
║              Structure Creator Script v1.0                  ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

Write-Host "`n🚀 Criando estrutura do projeto Angular EntraId..." -ForegroundColor White
Write-Host "📍 Caminho do projeto: $ProjectPath" -ForegroundColor White
Write-Host ""

# Verificar se deve criar projeto Angular
if ($CreateAngularProject) {
    Write-Host "🔧 Verificando Angular CLI..." -ForegroundColor Yellow
    
    try {
        $ngVersion = ng version --json 2>$null | ConvertFrom-Json
        Write-Host "✅ Angular CLI encontrado: $($ngVersion.packages.'@angular/cli'.version)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Angular CLI não encontrado. Instale com: npm install -g @angular/cli@latest" -ForegroundColor Red
        exit 1
    }

    Write-Host "📦 Criando projeto Angular..." -ForegroundColor Yellow
    if (Test-Path $ProjectPath) {
        if ($Force) {
            Remove-Item $ProjectPath -Recurse -Force
            Write-Host "🗑️  Diretório existente removido" -ForegroundColor Yellow
        } else {
            Write-Host "❌ Diretório já existe. Use -Force para sobrescrever" -ForegroundColor Red
            exit 1
        }
    }
    
    $projectName = Split-Path $ProjectPath -Leaf
    $parentPath = Split-Path $ProjectPath -Parent
    if ([string]::IsNullOrEmpty($parentPath)) { $parentPath = "." }
    
    Set-Location $parentPath
    ng new $projectName --routing --style=scss --standalone --skip-git --package-manager=npm
    Set-Location $projectName
    $ProjectPath = Get-Location
} else {
    # Criar diretório raiz se não existir
    New-DirectoryIfNotExists -Path $ProjectPath
    Set-Location $ProjectPath
}

Write-Host "`n📁 Criando estrutura de diretórios..." -ForegroundColor Yellow

# Estrutura de diretórios
$directories = @(
    "src",
    "src/app",
    "src/app/core",
    "src/app/core/models",
    "src/app/core/services",
    "src/app/core/guards",
    "src/app/core/interceptors",
    "src/app/features",
    "src/app/features/auth",
    "src/app/features/auth/login",
    "src/app/features/auth/callback",
    "src/app/features/dashboard",
    "src/app/features/profile",
    "src/app/shared",
    "src/app/shared/components",
    "src/app/shared/components/header",
    "src/app/shared/layout",
    "src/environments",
    "src/assets",
    "src/assets/images"
)

foreach ($dir in $directories) {
    New-DirectoryIfNotExists -Path $dir
}

Write-Host "`n📄 Criando arquivos do projeto..." -ForegroundColor Yellow

# Arquivos de configuração raiz
New-EmptyFile -FilePath "package.json" -Description "Dependências e scripts do projeto"
New-EmptyFile -FilePath "angular.json" -Description "Configuração do Angular CLI"
New-EmptyFile -FilePath "README.md" -Description "Documentação do projeto"
New-EmptyFile -FilePath "tsconfig.json" -Description "Configuração TypeScript"
New-EmptyFile -FilePath "tsconfig.app.json" -Description "Configuração TypeScript para app"
New-EmptyFile -FilePath "tsconfig.spec.json" -Description "Configuração TypeScript para testes"
New-EmptyFile -FilePath ".gitignore" -Description "Arquivos ignorados pelo Git"

# Arquivos de ambiente
New-EmptyFile -FilePath "src/environments/environment.ts" -Description "Configurações de desenvolvimento"
New-EmptyFile -FilePath "src/environments/environment.prod.ts" -Description "Configurações de produção"

# Arquivos principais da aplicação
New-EmptyFile -FilePath "src/main.ts" -Description "Bootstrap da aplicação"
New-EmptyFile -FilePath "src/styles.scss" -Description "Estilos globais da aplicação"
New-EmptyFile -FilePath "src/index.html" -Description "Página HTML principal"
New-EmptyFile -FilePath "src/favicon.ico" -Description "Ícone da aplicação"

# Arquivos do app principal
New-EmptyFile -FilePath "src/app/app.component.ts" -Description "Componente raiz da aplicação"
New-EmptyFile -FilePath "src/app/app.config.ts" -Description "Configuração da aplicação"
New-EmptyFile -FilePath "src/app/app.routes.ts" -Description "Rotas da aplicação"

# Modelos (Models)
Write-Host "`n📋 Criando modelos..." -ForegroundColor Magenta
New-EmptyFile -FilePath "src/app/core/models/user.model.ts" -Description "Interfaces de usuário e autenticação"
New-EmptyFile -FilePath "src/app/core/models/tenant.model.ts" -Description "Interfaces de tenant, grupos e login"
New-EmptyFile -FilePath "src/app/core/models/api-response.model.ts" -Description "Interface de resposta da API"

# Serviços (Services)
Write-Host "`n🔧 Criando serviços..." -ForegroundColor Magenta
New-EmptyFile -FilePath "src/app/core/services/msal.service.ts" -Description "Serviço de autenticação MSAL"
New-EmptyFile -FilePath "src/app/core/services/tenant.service.ts" -Description "Serviço de dados do tenant"

# Guards e Interceptors
Write-Host "`n🛡️ Criando guards e interceptors..." -ForegroundColor Magenta
New-EmptyFile -FilePath "src/app/core/guards/auth.guard.ts" -Description "Guard de autenticação de rotas"
New-EmptyFile -FilePath "src/app/core/interceptors/msal.interceptor.ts" -Description "Interceptor HTTP para tokens MSAL"

# Componentes de Autenticação
Write-Host "`n🔐 Criando componentes de autenticação..." -ForegroundColor Magenta
New-EmptyFile -FilePath "src/app/features/auth/login/login.component.ts" -Description "Componente de login com MSAL"
New-EmptyFile -FilePath "src/app/features/auth/callback/callback.component.ts" -Description "Componente de callback MSAL"

# Componentes Features
Write-Host "`n📊 Criando componentes principais..." -ForegroundColor Magenta
New-EmptyFile -FilePath "src/app/features/dashboard/dashboard.component.ts" -Description "Dashboard principal com métricas"
New-EmptyFile -FilePath "src/app/features/profile/profile.component.ts" -Description "Perfil detalhado do usuário"

# Componentes Shared
Write-Host "`n🔄 Criando componentes compartilhados..." -ForegroundColor Magenta
New-EmptyFile -FilePath "src/app/shared/components/header/header.component.ts" -Description "Header da aplicação"
New-EmptyFile -FilePath "src/app/shared/layout/main-layout.component.ts" -Description "Layout principal da aplicação"

# Arquivos adicionais úteis
Write-Host "`n📝 Criando arquivos adicionais..." -ForegroundColor Magenta
New-EmptyFile -FilePath ".editorconfig" -Description "Configuração do editor"
New-EmptyFile -FilePath ".eslintrc.json" -Description "Configuração ESLint"
New-EmptyFile -FilePath "karma.conf.js" -Description "Configuração de testes"

# Arquivos de deploy (opcionais)
New-EmptyFile -FilePath ".azure/staticwebapp.config.json" -Description "Configuração Azure Static Web Apps"
New-EmptyFile -FilePath "Dockerfile" -Description "Configuração Docker"

# Mostrar resumo
Write-Host "`n" + "="*80 -ForegroundColor Cyan
Write-Host "🎉 ESTRUTURA CRIADA COM SUCESSO!" -ForegroundColor Green
Write-Host "="*80 -ForegroundColor Cyan

Write-Host "`n📊 Estatísticas:" -ForegroundColor Yellow
$totalDirs = (Get-ChildItem -Recurse -Directory | Measure-Object).Count
$totalFiles = (Get-ChildItem -Recurse -File | Measure-Object).Count
Write-Host "   📁 Diretórios criados: $totalDirs" -ForegroundColor White
Write-Host "   📄 Arquivos criados: $totalFiles" -ForegroundColor White

Write-Host "`n📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Preencher os arquivos com o código fornecido" -ForegroundColor White
Write-Host "   2. Configurar credenciais Azure AD no environment.ts" -ForegroundColor White
Write-Host "   3. Instalar dependências: npm install" -ForegroundColor White
Write-Host "   4. Executar: npm start" -ForegroundColor White

Write-Host "`n📁 Estrutura criada em: $((Get-Location).Path)" -ForegroundColor Cyan

Write-Host "`n🔧 Comandos úteis:" -ForegroundColor Yellow
Write-Host "   # Instalar dependências Angular e PrimeNG" -ForegroundColor Gray
Write-Host "   npm install @azure/msal-angular @azure/msal-browser primeng primeicons primeflex" -ForegroundColor White
Write-Host ""
Write-Host "   # Executar aplicação" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor White
Write-Host ""
Write-Host "   # Build para produção" -ForegroundColor Gray
Write-Host "   npm run build --prod" -ForegroundColor White

Write-Host "`n✨ Estrutura pronta para desenvolvimento!" -ForegroundColor Green

# Criar arquivo de estrutura para referência
$structureFile = "ESTRUTURA-PROJETO.md"
$structureContent = @"
# Estrutura do Projeto Angular EntraId

Criado em: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## 📁 Estrutura de Diretórios

\`\`\`
entra-id-angular-app/
├── .azure/
│   └── staticwebapp.config.json
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── tenant.model.ts
│   │   │   │   └── api-response.model.ts
│   │   │   ├── services/
│   │   │   │   ├── msal.service.ts
│   │   │   │   └── tenant.service.ts
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   └── interceptors/
│   │   │       └── msal.interceptor.ts
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── login.component.ts
│   │   │   │   └── callback/
│   │   │   │       └── callback.component.ts
│   │   │   ├── dashboard/
│   │   │   │   └── dashboard.component.ts
│   │   │   └── profile/
│   │   │       └── profile.component.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   └── header/
│   │   │   │       └── header.component.ts
│   │   │   └── layout/
│   │   │       └── main-layout.component.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── assets/
│   │   └── images/
│   ├── main.ts
│   ├── styles.scss
│   ├── index.html
│   └── favicon.ico
├── package.json
├── angular.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── karma.conf.js
├── .eslintrc.json
├── .editorconfig
├── .gitignore
├── Dockerfile
└── README.md
\`\`\`

## 🎯 Descrição dos Arquivos

### Configuração
- **package.json**: Dependências e scripts do projeto
- **angular.json**: Configuração do Angular CLI
- **tsconfig.json**: Configuração TypeScript global
- **README.md**: Documentação do projeto

### Core (Núcleo)
- **models/**: Interfaces TypeScript para dados
- **services/**: Serviços de negócio e integração
- **guards/**: Guards de autenticação de rotas
- **interceptors/**: Interceptors HTTP

### Features (Funcionalidades)
- **auth/**: Componentes de autenticação
- **dashboard/**: Dashboard principal
- **profile/**: Perfil do usuário

### Shared (Compartilhado)
- **components/**: Componentes reutilizáveis
- **layout/**: Layouts da aplicação

### Environments
- **environment.ts**: Configurações de desenvolvimento
- **environment.prod.ts**: Configurações de produção

## 🚀 Tecnologias

- Angular 17+ (Standalone Components)
- PrimeNG 17+ (Material Theme)
- MSAL Angular (Microsoft Authentication)
- TypeScript 5.4+
- SCSS
- RxJS com Signals

## ⚙️ Configuração

1. Preencher arquivos com código fornecido
2. Configurar Azure AD no environment.ts
3. \`npm install\`
4. \`npm start\`

---
Gerado automaticamente pelo script Create-Angular-Project-Structure.ps1
"@

Set-Content -Path $structureFile -Value $structureContent -Encoding UTF8
Write-Host "`n📋 Arquivo de referência criado: $structureFile" -ForegroundColor Green

Write-Host "`n🎯 Script concluído com sucesso!" -ForegroundColor Green