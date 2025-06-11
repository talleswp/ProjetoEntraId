using EntraIdWebApi.Models.DTOs;
using EntraIdWebApi.Models.Responses;
using EntraIdWebApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EntraIdWebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IUserService userService, ILogger<AuthController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// Obtém informações do usuário autenticado via MSAL
    /// </summary>
    [HttpGet("user")]
    public async Task<ActionResult<ApiResponse<UserInfoDto>>> GetUserInfo()
    {
        try
        {
            _logger.LogInformation("Requisição para obter informações do usuário autenticado via MSAL");

            // Extrair informações do token MSAL
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                        ?? User.FindFirst("oid")?.Value;
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value
                           ?? User.FindFirst("preferred_username")?.Value;
            var userName = User.FindFirst(ClaimTypes.Name)?.Value
                          ?? User.FindFirst("name")?.Value;
            var tenantId = User.FindFirst("tid")?.Value;

            _logger.LogInformation("Token MSAL - UserId: {UserId}, Email: {Email}, TenantId: {TenantId}",
                userId, userEmail, tenantId);

            var userInfo = await _userService.GetUserInfoAsync();

            if (userInfo == null)
            {
                // Se falhar ao obter do Graph, usar dados do token
                userInfo = new UserInfoDto
                {
                    Id = userId ?? "unknown",
                    DisplayName = userName ?? "Unknown User",
                    Email = userEmail ?? "unknown@domain.com",
                    TenantId = tenantId ?? "unknown"
                };
            }

            return Ok(ApiResponse<UserInfoDto>.SuccessResponse(userInfo, "Informações do usuário obtidas com sucesso"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter informações do usuário");
            return StatusCode(500, ApiResponse<UserInfoDto>.ErrorResponse("Erro interno do servidor"));
        }
    }

    /// <summary>
    /// Verifica se o usuário está autenticado via MSAL
    /// </summary>
    [HttpGet("status")]
    public IActionResult GetAuthStatus()
    {
        var isAuthenticated = User.Identity?.IsAuthenticated ?? false;

        var response = new
        {
            IsAuthenticated = isAuthenticated,
            AuthenticationType = User.Identity?.AuthenticationType,
            TokenType = "Bearer (MSAL)",
            Claims = User.Claims.Select(c => new {
                Type = c.Type,
                Value = c.Value,
                // Apenas algumas claims importantes para debug
                Description = GetClaimDescription(c.Type)
            }).Take(10).ToList(), // Limitar para não expor muitas informações
            UserId = User.FindFirst("oid")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            TenantId = User.FindFirst("tid")?.Value,
            UserEmail = User.FindFirst("preferred_username")?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value
        };

        return Ok(ApiResponse<object>.SuccessResponse(response, "Status de autenticação MSAL obtido"));
    }

    private static string GetClaimDescription(string claimType)
    {
        return claimType switch
        {
            "oid" => "Object ID do usuário",
            "tid" => "Tenant ID",
            "preferred_username" => "Email do usuário",
            "name" => "Nome do usuário",
            "given_name" => "Primeiro nome",
            "family_name" => "Sobrenome",
            "roles" => "Roles do usuário",
            "scp" => "Scopes autorizados",
            _ => "Claim padrão"
        };
    }
}