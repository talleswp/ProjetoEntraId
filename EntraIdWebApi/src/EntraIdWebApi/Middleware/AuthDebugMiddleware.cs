using System.IdentityModel.Tokens.Jwt;

namespace EntraIdWebApi.Middleware;

public class AuthDebugMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<AuthDebugMiddleware> _logger;

    public AuthDebugMiddleware(RequestDelegate next, ILogger<AuthDebugMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Log apenas para endpoints da API
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            await LogAuthenticationDetails(context);
        }

        await _next(context);
    }

    private async Task LogAuthenticationDetails(HttpContext context)
    {
        _logger.LogInformation("🔍 === DEBUG AUTENTICAÇÃO ===");
        _logger.LogInformation("📄 Request: {Method} {Path}", context.Request.Method, context.Request.Path);

        // Check Authorization header
        if (context.Request.Headers.TryGetValue("Authorization", out var authHeaders))
        {
            var authHeader = authHeaders.FirstOrDefault();
            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring("Bearer ".Length);
                _logger.LogInformation("🎫 Token presente (length: {Length})", token.Length);

                // Decodificar token JWT (sem validar)
                try
                {
                    var handler = new JwtSecurityTokenHandler();
                    var jsonToken = handler.ReadJwtToken(token);

                    _logger.LogInformation("🎫 Token Claims:");
                    foreach (var claim in jsonToken.Claims.Take(10))
                    {
                        _logger.LogInformation("   {Type}: {Value}", claim.Type, claim.Value);
                    }

                    _logger.LogInformation("🎫 Token Audience: {Audience}", string.Join(", ", jsonToken.Audiences));
                    _logger.LogInformation("🎫 Token Issuer: {Issuer}", jsonToken.Issuer);
                    _logger.LogInformation("🎫 Token Expires: {Expires}", jsonToken.ValidTo);
                }
                catch (Exception ex)
                {
                    _logger.LogError("❌ Erro ao decodificar token: {Error}", ex.Message);
                }
            }
        }
        else
        {
            _logger.LogWarning("⚠️ Nenhum header Authorization encontrado");
        }

        _logger.LogInformation("👤 User.Identity.IsAuthenticated: {IsAuth}", context.User.Identity?.IsAuthenticated);
        _logger.LogInformation("👤 User.Claims.Count: {ClaimsCount}", context.User.Claims.Count());
        _logger.LogInformation("🔍 === FIM DEBUG ===");
    }
}