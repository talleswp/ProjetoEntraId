using EntraIdWebApi.Models.DTOs;
using EntraIdWebApi.Services.Interfaces;

namespace EntraIdWebApi.Services;

public class UserService : IUserService
{
    private readonly IGraphService _graphService;
    private readonly ILogger<UserService> _logger;

    public UserService(IGraphService graphService, ILogger<UserService> logger)
    {
        _graphService = graphService;
        _logger = logger;
    }

    public async Task<UserInfoDto?> GetUserInfoAsync()
    {
        _logger.LogInformation("Obtendo informações do usuário autenticado");
        return await _graphService.GetCurrentUserAsync();
    }

    public async Task<TenantInfoDto?> GetTenantDetailsAsync()
    {
        _logger.LogInformation("Obtendo informações detalhadas do tenant");
        return await _graphService.GetTenantInfoAsync();
    }
}
