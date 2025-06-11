using EntraIdWebApi.Services;
using EntraIdWebApi.Services.Interfaces;

namespace EntraIdWebApi.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddCustomServices(this IServiceCollection services, IConfiguration configuration)
    {
        // ✅ Registrar serviços customizados
        services.AddScoped<IGraphService, GraphService>();
        services.AddScoped<IUserService, UserService>();

        // ✅ Adicionar HttpContextAccessor para acessar claims
        services.AddHttpContextAccessor();

        return services;
    }
}