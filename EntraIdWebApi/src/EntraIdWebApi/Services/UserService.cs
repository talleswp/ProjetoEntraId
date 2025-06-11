using EntraIdWebApi.Models.DTOs;
using EntraIdWebApi.Services.Interfaces;
using System.Security.Claims;

namespace EntraIdWebApi.Services;

public class UserService : IUserService
{
    private readonly IGraphService _graphService;
    private readonly ILogger<UserService> _logger;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserService(
        IGraphService graphService,
        ILogger<UserService> logger,
        IHttpContextAccessor httpContextAccessor)
    {
        _graphService = graphService;
        _logger = logger;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<UserInfoDto?> GetUserInfoAsync()
    {
        try
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext?.User?.Identity?.IsAuthenticated != true)
            {
                _logger.LogWarning("Usuário não autenticado");
                return null;
            }

            // Extrair UserPrincipalName do token MSAL
            var userPrincipalName = httpContext.User.FindFirst("preferred_username")?.Value
                                  ?? httpContext.User.FindFirst(ClaimTypes.Email)?.Value
                                  ?? httpContext.User.FindFirst(ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(userPrincipalName))
            {
                _logger.LogWarning("UserPrincipalName não encontrado no token");

                // Fallback: usar claims do token
                var userId = httpContext.User.FindFirst("oid")?.Value ?? httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var displayName = httpContext.User.FindFirst("name")?.Value ?? httpContext.User.FindFirst(ClaimTypes.Name)?.Value;
                var email = httpContext.User.FindFirst("preferred_username")?.Value ?? httpContext.User.FindFirst(ClaimTypes.Email)?.Value;
                var tenantId = httpContext.User.FindFirst("tid")?.Value;

                return new UserInfoDto
                {
                    Id = userId ?? "unknown",
                    DisplayName = displayName ?? "Unknown User",
                    Email = email ?? "unknown@domain.com",
                    TenantId = tenantId ?? "unknown",
                    JobTitle = string.Empty,
                    Department = string.Empty
                };
            }

            _logger.LogInformation("Obtendo informações do Graph para: {UserPrincipalName}", userPrincipalName);
            return await _graphService.GetCurrentUserAsync(userPrincipalName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter informações do usuário");
            return null;
        }
    }

    public async Task<TenantInfoDto?> GetTenantDetailsAsync()
    {
        _logger.LogInformation("Obtendo informações detalhadas do tenant");
        return await _graphService.GetTenantInfoAsync();
    }
}