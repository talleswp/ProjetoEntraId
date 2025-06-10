namespace EntraIdWebApi.Models.DTOs;

public class LoginAttemptDto
{
    public string UserId { get; set; } = string.Empty;
    public string UserDisplayName { get; set; } = string.Empty;
    public string UserPrincipalName { get; set; } = string.Empty;
    public DateTime CreatedDateTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string ClientAppUsed { get; set; } = string.Empty;
}
