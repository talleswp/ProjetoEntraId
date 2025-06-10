using EntraIdWebApi.Models.DTOs;

namespace EntraIdWebApi.Services.Interfaces;

public interface IGraphService
{
    Task<UserInfoDto?> GetCurrentUserAsync();
    Task<TenantInfoDto?> GetTenantInfoAsync();
    Task<List<UserInfoDto>> GetTenantUsersAsync(int top = 50);
    Task<List<GroupInfoDto>> GetTenantGroupsAsync(int top = 50);
    Task<List<LoginAttemptDto>> GetRecentLoginAttemptsAsync(int top = 50);
}
