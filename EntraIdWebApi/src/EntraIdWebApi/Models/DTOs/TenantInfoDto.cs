namespace EntraIdWebApi.Models.DTOs;

public class TenantInfoDto
{
    public string TenantId { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string[] VerifiedDomains { get; set; } = Array.Empty<string>();
    public int TotalUsers { get; set; }
    public int TotalGroups { get; set; }
    public List<UserInfoDto> RecentUsers { get; set; } = new();
    public List<GroupInfoDto> Groups { get; set; } = new();
    public List<LoginAttemptDto> RecentLoginAttempts { get; set; } = new();
}

public class GroupInfoDto
{
    public string Id { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int MemberCount { get; set; }
    public DateTime CreatedDateTime { get; set; }
}
