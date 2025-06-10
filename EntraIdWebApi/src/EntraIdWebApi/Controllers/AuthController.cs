using EntraIdWebApi.Models.DTOs;
using EntraIdWebApi.Models.Responses;
using EntraIdWebApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
    /// Obtém informações do usuário autenticado
    /// </summary>
    [HttpGet("user")]
    public async Task<ActionResult<ApiResponse<UserInfoDto>>> GetUserInfo()
    {
        try
        {
            _logger.LogInformation("Requisição para obter informações do usuário autenticado");
            
            var userInfo = await _userService.GetUserInfoAsync();
            
            if (userInfo == null)
            {
                return NotFound(ApiResponse<UserInfoDto>.ErrorResponse("Usuário não encontrado"));
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
    /// Verifica se o usuário está autenticado
    /// </summary>
    [HttpGet("status")]
    public IActionResult GetAuthStatus()
    {
        var response = new
        {
            IsAuthenticated = User.Identity?.IsAuthenticated ?? false,
            Claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList()
        };

        return Ok(ApiResponse<object>.SuccessResponse(response, "Status de autenticação obtido"));
    }
}
