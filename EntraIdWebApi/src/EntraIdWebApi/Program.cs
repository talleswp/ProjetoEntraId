using EntraIdWebApi.Configuration;
using EntraIdWebApi.Extensions;
using EntraIdWebApi.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configuração do Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .WriteTo.Console()
    .WriteTo.File("logs/app-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Configuração do Azure AD
builder.Services.Configure<AzureAdConfiguration>(
    builder.Configuration.GetSection("AzureAd"));

var azureAdConfig = builder.Configuration.GetSection("AzureAd").Get<AzureAdConfiguration>();
if (azureAdConfig == null)
{
    throw new InvalidOperationException("Configuração AzureAd não encontrada");
}

// ✅ CONFIGURAÇÃO JWT BEARER MANUAL
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = $"{azureAdConfig.Instance}{azureAdConfig.TenantId}/v2.0";

        options.Audience = azureAdConfig.Audience; 

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            //ValidIssuer = $"{azureAdConfig.Instance}{azureAdConfig.TenantId}/v2.0",
            ValidIssuers = new[] {
                $"https://login.microsoftonline.com/{azureAdConfig.TenantId}/v2.0",
                $"https://sts.windows.net/{azureAdConfig.TenantId}/"
            },
            ValidateAudience = true,
            ValidAudience = azureAdConfig.Audience,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.FromMinutes(5)
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                var claims = context.Principal?.Claims.Select(c => $"{c.Type}={c.Value}");
                logger.LogInformation("✅ Token validado. Claims: {Claims}", string.Join(", ", claims ?? Array.Empty<string>()));
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                logger.LogError("❌ Falha na autenticação: {Error}", context.Exception.Message);
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                logger.LogWarning("⚠️ Desafio de autenticação: {Error}", context.Error);
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// Registrar serviços customizados
builder.Services.AddCustomServices(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "EntraId Web API",
        Version = "v1",
        Description = "API .NET 8 com Microsoft Graph 5.x + Azure.Identity"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header usando Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200", "http://localhost:4201", "https://localhost:4201")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Debug middleware
app.Use(async (context, next) =>
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogInformation("📥 {Method} {Path}", context.Request.Method, context.Request.Path);

    if (context.Request.Headers.ContainsKey("Authorization"))
    {
        var authHeader = context.Request.Headers["Authorization"].ToString();
        logger.LogInformation("🔐 Auth header: {Header}", authHeader.Substring(0, Math.Min(50, authHeader.Length)) + "...");
    }

    await next();
});

app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseHttpsRedirection();
app.UseCors("AllowAngularApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Endpoint de debug
app.MapGet("/debug/auth", (HttpContext context) =>
{
    var claims = context.User.Claims.Select(c => new { c.Type, c.Value }).ToList();
    return Results.Ok(new
    {
        IsAuthenticated = context.User.Identity?.IsAuthenticated ?? false,
        ClaimsCount = claims.Count,
        Claims = claims.Take(10)
    });
}).RequireAuthorization();

try
{
    Log.Information("🚀 Iniciando EntraId Web API");
    Log.Information("🌐 Swagger: https://localhost:{{Port}}/swagger");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "❌ Falha ao iniciar aplicação");
}
finally
{
    Log.CloseAndFlush();
}