using EntraIdWebApi.Models.DTOs;
using EntraIdWebApi.Services.Interfaces;
using Microsoft.Graph;
using Microsoft.Graph.Models;

namespace EntraIdWebApi.Services;

public class GraphService : IGraphService
{
    private readonly GraphServiceClient _graphServiceClient;
    private readonly ILogger<GraphService> _logger;

    public GraphService(GraphServiceClient graphServiceClient, ILogger<GraphService> logger)
    {
        _graphServiceClient = graphServiceClient;
        _logger = logger;
    }

    public async Task<UserInfoDto?> GetCurrentUserAsync()
    {
        try
        {
            var user = await _graphServiceClient.Me.GetAsync();
            
            if (user == null) return null;

            return new UserInfoDto
            {
                Id = user.Id ?? string.Empty,
                DisplayName = user.DisplayName ?? string.Empty,
                Email = user.Mail ?? user.UserPrincipalName ?? string.Empty,
                JobTitle = user.JobTitle ?? string.Empty,
                Department = user.Department ?? string.Empty
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter informações do usuário atual");
            return null;
        }
    }

    public async Task<TenantInfoDto?> GetTenantInfoAsync()
    {
        try
        {
            var organization = await _graphServiceClient.Organization.GetAsync();
            var orgInfo = organization?.Value?.FirstOrDefault();
            
            if (orgInfo == null) return null;

            var tenantInfo = new TenantInfoDto
            {
                TenantId = orgInfo.Id ?? string.Empty,
                DisplayName = orgInfo.DisplayName ?? string.Empty,
                VerifiedDomains = orgInfo.VerifiedDomains?.Select(d => d.Name ?? string.Empty).ToArray() ?? Array.Empty<string>()
            };

            // Obter contagens
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
            var users = await _graphServiceClient.Users
                .GetAsync(config =>
                {
                    config.QueryParameters.Top = top;
                    config.QueryParameters.Select = new[] { "id", "displayName", "mail", "userPrincipalName", "jobTitle", "department" };
                });

            return users?.Value?.Select(user => new UserInfoDto
            {
                Id = user.Id ?? string.Empty,
                DisplayName = user.DisplayName ?? string.Empty,
                Email = user.Mail ?? user.UserPrincipalName ?? string.Empty,
                JobTitle = user.JobTitle ?? string.Empty,
                Department = user.Department ?? string.Empty
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
            var groups = await _graphServiceClient.Groups
                .GetAsync(config =>
                {
                    config.QueryParameters.Top = top;
                    config.QueryParameters.Select = new[] { "id", "displayName", "description", "createdDateTime" };
                });

            var result = new List<GroupInfoDto>();

            if (groups?.Value != null)
            {
                foreach (var group in groups.Value)
                {
                    var memberCount = 0;
                    try
                    {
                        var members = await _graphServiceClient.Groups[group.Id].Members.GetAsync();
                        memberCount = members?.Value?.Count ?? 0;
                    }
                    catch
                    {
                        // Ignorar erros de permissão
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
            var signIns = await _graphServiceClient.AuditLogs.SignIns
                .GetAsync(config =>
                {
                    config.QueryParameters.Top = top;
                    config.QueryParameters.Orderby = new[] { "createdDateTime desc" };
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
