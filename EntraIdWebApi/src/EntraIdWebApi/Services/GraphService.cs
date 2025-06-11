using EntraIdWebApi.Models.DTOs;
using EntraIdWebApi.Services.Interfaces;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using Azure.Identity;
using EntraIdWebApi.Configuration;
using Microsoft.Extensions.Options;

namespace EntraIdWebApi.Services;

public class GraphService : IGraphService
{
    private readonly GraphServiceClient _graphServiceClient;
    private readonly ILogger<GraphService> _logger;
    private readonly AzureAdConfiguration _azureAdConfig;

    public GraphService(IOptions<AzureAdConfiguration> azureAdConfig, ILogger<GraphService> logger)
    {
        _azureAdConfig = azureAdConfig.Value;
        _logger = logger;

        // ✅ USAR Azure.Identity para autenticação
        var credential = new ClientSecretCredential(
            _azureAdConfig.TenantId,
            _azureAdConfig.ClientId,
            _azureAdConfig.ClientSecret
        );

        _graphServiceClient = new GraphServiceClient(credential);
    }

    public async Task<UserInfoDto?> GetCurrentUserAsync(string userPrincipalName)
    {
        try
        {
            _logger.LogInformation("Obtendo informações do usuário: {UserPrincipalName}", userPrincipalName);

            // Buscar usuário por UserPrincipalName
            var user = await _graphServiceClient.Users[userPrincipalName].GetAsync();

            if (user == null)
            {
                _logger.LogWarning("Usuário não encontrado: {UserPrincipalName}", userPrincipalName);
                return null;
            }

            return new UserInfoDto
            {
                Id = user.Id ?? string.Empty,
                DisplayName = user.DisplayName ?? string.Empty,
                Email = user.Mail ?? user.UserPrincipalName ?? string.Empty,
                TenantId = _azureAdConfig.TenantId,
                JobTitle = user.JobTitle ?? string.Empty,
                Department = user.Department ?? string.Empty,
                LastSignInDateTime = user.SignInActivity?.LastSignInDateTime?.DateTime
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter informações do usuário: {UserPrincipalName}", userPrincipalName);
            return null;
        }
    }

    public async Task<TenantInfoDto?> GetTenantInfoAsync()
    {
        try
        {
            _logger.LogInformation("Obtendo informações do tenant");

            var organization = await _graphServiceClient.Organization.GetAsync();
            var orgInfo = organization?.Value?.FirstOrDefault();

            if (orgInfo == null)
            {
                _logger.LogWarning("Informações da organização não encontradas");
                return null;
            }

            var tenantInfo = new TenantInfoDto
            {
                TenantId = orgInfo.Id ?? _azureAdConfig.TenantId,
                DisplayName = orgInfo.DisplayName ?? "Unknown Organization",
                VerifiedDomains = orgInfo.VerifiedDomains?.Select(d => d.Name ?? string.Empty).ToArray() ?? Array.Empty<string>()
            };

            // Obter estatísticas
            var users = await GetTenantUsersAsync(10);
            var groups = await GetTenantGroupsAsync(10);
            var loginAttempts = await GetRecentLoginAttemptsAsync(10);

            tenantInfo.TotalUsers = users.Count;
            tenantInfo.TotalGroups = groups.Count;
            tenantInfo.RecentUsers = users;
            tenantInfo.Groups = groups;
            tenantInfo.RecentLoginAttempts = loginAttempts;

            return tenantInfo;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter informações do tenant");
            return null;
        }
    }

    public async Task<List<UserInfoDto>> GetTenantUsersAsync(int top = 50)
    {
        try
        {
            _logger.LogInformation("Obtendo usuários do tenant (top: {Top})", top);

            var users = await _graphServiceClient.Users
                .GetAsync(config =>
                {
                    config.QueryParameters.Top = top;
                    config.QueryParameters.Select = new[] {
                        "id", "displayName", "mail", "userPrincipalName",
                        "jobTitle", "department", "signInActivity"
                    };
                    config.QueryParameters.Orderby = new[] { "displayName" };
                });

            return users?.Value?.Select(user => new UserInfoDto
            {
                Id = user.Id ?? string.Empty,
                DisplayName = user.DisplayName ?? string.Empty,
                Email = user.Mail ?? user.UserPrincipalName ?? string.Empty,
                TenantId = _azureAdConfig.TenantId,
                JobTitle = user.JobTitle ?? string.Empty,
                Department = user.Department ?? string.Empty,
                LastSignInDateTime = user.SignInActivity?.LastSignInDateTime?.DateTime
            }).ToList() ?? new List<UserInfoDto>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter usuários do tenant");
            return new List<UserInfoDto>();
        }
    }

    public async Task<List<GroupInfoDto>> GetTenantGroupsAsync(int top = 50)
    {
        try
        {
            _logger.LogInformation("Obtendo grupos do tenant (top: {Top})", top);

            var groups = await _graphServiceClient.Groups
                .GetAsync(config =>
                {
                    config.QueryParameters.Top = top;
                    config.QueryParameters.Select = new[] {
                        "id", "displayName", "description", "createdDateTime", "memberCountV2"
                    };
                    config.QueryParameters.Orderby = new[] { "displayName" };
                });

            var result = new List<GroupInfoDto>();

            if (groups?.Value != null)
            {
                foreach (var group in groups.Value)
                {
                    // Tentar obter contagem de membros
                    var memberCount = 0;
                    try
                    {
                        var members = await _graphServiceClient.Groups[group.Id].Members.GetAsync(config =>
                        {
                            config.QueryParameters.Count = true;
                            config.QueryParameters.Top = 1;
                        });
                        memberCount = (int)(members?.OdataCount ?? 0);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogDebug("Não foi possível obter contagem de membros para o grupo {GroupId}: {Error}",
                            group.Id, ex.Message);
                    }

                    result.Add(new GroupInfoDto
                    {
                        Id = group.Id ?? string.Empty,
                        DisplayName = group.DisplayName ?? string.Empty,
                        Description = group.Description ?? string.Empty,
                        MemberCount = memberCount,
                        CreatedDateTime = group.CreatedDateTime?.DateTime ?? DateTime.MinValue
                    });
                }
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter grupos do tenant");
            return new List<GroupInfoDto>();
        }
    }

    public async Task<List<LoginAttemptDto>> GetRecentLoginAttemptsAsync(int top = 50)
    {
        try
        {
            _logger.LogInformation("Obtendo tentativas de login recentes (top: {Top})", top);

            var signIns = await _graphServiceClient.AuditLogs.SignIns
                .GetAsync(config =>
                {
                    config.QueryParameters.Top = top;
                    config.QueryParameters.Orderby = new[] { "createdDateTime desc" };
                    config.QueryParameters.Select = new[] {
                        "userId", "userDisplayName", "userPrincipalName",
                        "createdDateTime", "status", "ipAddress", "location", "clientAppUsed"
                    };
                });

            return signIns?.Value?.Select(signIn => new LoginAttemptDto
            {
                UserId = signIn.UserId ?? string.Empty,
                UserDisplayName = signIn.UserDisplayName ?? string.Empty,
                UserPrincipalName = signIn.UserPrincipalName ?? string.Empty,
                CreatedDateTime = signIn.CreatedDateTime?.DateTime ?? DateTime.MinValue,
                Status = signIn.Status?.ErrorCode?.ToString() ?? "Success",
                IpAddress = signIn.IpAddress ?? string.Empty,
                Location = $"{signIn.Location?.City}, {signIn.Location?.CountryOrRegion}",
                ClientAppUsed = signIn.ClientAppUsed ?? string.Empty
            }).ToList() ?? new List<LoginAttemptDto>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter tentativas de login recentes");
            return new List<LoginAttemptDto>();
        }
    }
}