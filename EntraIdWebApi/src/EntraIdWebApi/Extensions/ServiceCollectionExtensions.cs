using EntraIdWebApi.Services;
using EntraIdWebApi.Services.Interfaces;
using Microsoft.Identity.Web;

namespace EntraIdWebApi.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddCustomServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Microsoft.Identity.Web.MicrosoftGraph já registra automaticamente o GraphServiceClient
        // quando AddMicrosoftIdentityWebApiAuthentication é chamado no Program.cs
        
        // Adicionar suporte ao Microsoft Graph
        services.AddMicrosoftGraph();

        // Registrar serviços customizados
        services.AddScoped<IGraphService, GraphService>();
        services.AddScoped<IUserService, UserService>();

        return services;
    }
}
