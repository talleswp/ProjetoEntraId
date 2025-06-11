using EntraIdWebApi.Models.DTOs;

namespace EntraIdWebApi.Services.Interfaces;

public interface IUserService
{
    Task<UserInfoDto?> GetUserInfoAsync();
    Task<TenantInfoDto?> GetTenantDetailsAsync();
}