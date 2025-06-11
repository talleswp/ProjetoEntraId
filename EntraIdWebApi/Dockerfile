# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["src/EntraIdWebApi/EntraIdWebApi.csproj", "src/EntraIdWebApi/"]
COPY ["src/EntraIdWebApi.Tests/EntraIdWebApi.Tests.csproj", "src/EntraIdWebApi.Tests/"]

# Restore dependencies
RUN dotnet restore "src/EntraIdWebApi/EntraIdWebApi.csproj"

# Copy source code
COPY . .

# Build application
WORKDIR "/src/src/EntraIdWebApi"
RUN dotnet build "EntraIdWebApi.csproj" -c Release -o /app/build

# Publish Stage
FROM build AS publish
RUN dotnet publish "EntraIdWebApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

# Create non-root user
RUN groupadd -r dotnet && useradd -r -g dotnet dotnet

# Set working directory
WORKDIR /app

# Copy published application
COPY --from=publish /app/publish .

# Copy appsettings template
COPY src/EntraIdWebApi/appsettings.template.json ./appsettings.template.json

# Copy environment substitution script
COPY scripts/substitute-dotnet-env.sh ./substitute-env.sh
RUN chmod +x ./substitute-env.sh

# Create directories for logs and certificates
RUN mkdir -p /app/logs /app/certificates && \
    chown -R dotnet:dotnet /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

# Switch to non-root user
USER dotnet

# Expose ports
EXPOSE 80
EXPOSE 443

# Set environment variables
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production

# Entry point with environment substitution
ENTRYPOINT ["sh", "-c", "./substitute-env.sh && dotnet EntraIdWebApi.dll"]