using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace EntraIdWebApi.Services;

public interface ITokenValidationService
{
    Task<ClaimsPrincipal?> ValidateTokenAsync(string token);
}

public class TokenValidationService : ITokenValidationService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<TokenValidationService> _logger;

    public TokenValidationService(IConfiguration configuration, ILogger<TokenValidationService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<ClaimsPrincipal?> ValidateTokenAsync(string token)
    {
        try
        {
            var handler = new JwtSecurityTokenHandler();
            
            // Configurações de validação para tokens MSAL
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = $"https://login.microsoftonline.com/{_configuration["AzureAd:TenantId"]}/v2.0",
                ValidateAudience = true,
                ValidAudience = _configuration["AzureAd:ClientId"],
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                // Microsoft assina os tokens automaticamente
                IssuerSigningKeyResolver = (token, securityToken, kid, validationParameters) =>
                {
                    // Resolver chaves de assinatura da Microsoft
                    return GetMicrosoftSigningKeys();
                },
                ClockSkew = TimeSpan.FromMinutes(5)
            };

            var principal = handler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
            return principal;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao validar token");
            return null;
        }
    }

    private IEnumerable<SecurityKey> GetMicrosoftSigningKeys()
    {
        // Em produção, você deve buscar as chaves do endpoint da Microsoft
        // https://login.microsoftonline.com/{tenant}/discovery/v2.0/keys
        // Para simplificar, retornamos uma lista vazia (Microsoft.Identity.Web já faz isso)
        return new List<SecurityKey>();
    }
}