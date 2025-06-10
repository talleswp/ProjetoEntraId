using EntraIdWebApi.Models.DTOs;
using EntraIdWebApi.Models.Responses;
using EntraIdWebApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EntraIdWebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TenantController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IGraphService _graphService;
    private readonly ILogger<TenantController> _logger;

    public TenantController(IUserService userService, IGraphService graphService, ILogger<TenantController> logger)
    {
        _userService = userService;
        _graphService = graphService;
        _logger = logger;
    }

    /// <summary>
    /// Obtém informações completas do tenant
    /// </summary>
    [HttpGet("info")]
    public async Task<ActionResult<ApiResponse<TenantInfoDto>>> GetTenantInfo()
    {
        try
        {
            _logger.LogInformation("Requisição para obter informações do tenant");
            
            var tenantInfo = await _userService.GetTenantDetailsAsync();
            
            if (tenantInfo == null)
            {
                return NotFound(ApiResponse<TenantInfoDto>.ErrorResponse("Informações do tenant não encontradas"));
            }

            return Ok(ApiResponse<TenantInfoDto>.SuccessResponse(tenantInfo, "Informações do tenant obtidas com sucesso"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter informações do tenant");
            return StatusCode(500, ApiResponse<TenantInfoDto>.ErrorResponse("Erro interno do servidor"));
        }
    }

    /// <summary>
    /// Obtém usuários do tenant
    /// </summary>
    [HttpGet("users")]
    public async Task<ActionResult<ApiResponse<List<UserInfoDto>>>> GetTenantUsers([FromQuery] int top = 50)
    {
        try
        {
            _logger.LogInformation("Requisição para obter usuários do tenant");
            
            var users = await _graphService.GetTenantUsersAsync(top);
            
            return Ok(ApiResponse<List<UserInfoDto>>.SuccessResponse(users, "Usuários do tenant obtidos com sucesso"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter usuários do tenant");
            return StatusCode(500, ApiResponse<List<UserInfoDto>>.ErrorResponse("Erro interno do servidor"));
        }
    }

    /// <summary>
    /// Obtém grupos do tenant
    /// </summary>
    [HttpGet("groups")]
    public async Task<ActionResult<ApiResponse<List<GroupInfoDto>>>> GetTenantGroups([FromQuery] int top = 50)
    {
        try
        {
            _logger.LogInformation("Requisição para obter grupos do tenant");
            
            var groups = await _graphService.GetTenantGroupsAsync(top);
            
            return Ok(ApiResponse<List<GroupInfoDto>>.SuccessResponse(groups, "Grupos do tenant obtidos com sucesso"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter grupos do tenant");
            return StatusCode(500, ApiResponse<List<GroupInfoDto>>.ErrorResponse("Erro interno do servidor"));
        }
    }

    /// <summary>
    /// Obtém tentativas de login recentes
    /// </summary>
    [HttpGet("login-attempts")]
    public async Task<ActionResult<ApiResponse<List<LoginAttemptDto>>>> GetRecentLoginAttempts([FromQuery] int top = 50)
    {
        try
        {
            _logger.LogInformation("Requisição para obter tentativas de login recentes");
            
            var loginAttempts = await _graphService.GetRecentLoginAttemptsAsync(top);
            
            return Ok(ApiResponse<List<LoginAttemptDto>>.SuccessResponse(loginAttempts, "Tentativas de login obtidas com sucesso"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter tentativas de login");
            return StatusCode(500, ApiResponse<List<LoginAttemptDto>>.ErrorResponse("Erro interno do servidor"));
        }
    }
}
