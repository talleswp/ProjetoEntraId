namespace EntraIdWebApi.Configuration;

public class AzureAdConfiguration
{
    public string Instance { get; set; } = "https://login.microsoftonline.com/";
    public string TenantId { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public string[] ValidIssuers { get; set; } = Array.Empty<string>();
    public string[] Scopes { get; set; } = Array.Empty<string>();
}