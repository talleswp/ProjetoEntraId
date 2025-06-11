# Estrutura do Projeto Angular EntraId

Criado em: 2025-06-10 21:16:14

## 📁 Estrutura de Diretórios

\\\
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
\\\

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
3. \
pm install\
4. \
pm start\

---
Gerado automaticamente pelo script Create-Angular-Project-Structure.ps1
