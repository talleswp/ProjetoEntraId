using EntraIdWebApi.Models.DTOs;
using EntraIdWebApi.Services;
using EntraIdWebApi.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using Moq;
using Xunit;

namespace EntraIdWebApi.Tests;

public class UserServiceTests
{
    private readonly Mock<IGraphService> _mockGraphService;
    private readonly Mock<ILogger<UserService>> _mockLogger;
    private readonly UserService _userService;

    public UserServiceTests()
    {
        _mockGraphService = new Mock<IGraphService>();
        _mockLogger = new Mock<ILogger<UserService>>();
        _userService = new UserService(_mockGraphService.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task GetUserInfoAsync_ShouldReturnUserInfo_WhenGraphServiceReturnsUser()
    {
        // Arrange
        var expectedUser = new UserInfoDto
        {
            Id = "test-id",
            DisplayName = "Test User",
            Email = "test@example.com"
        };

        _mockGraphService.Setup(x => x.GetCurrentUserAsync())
                        .ReturnsAsync(expectedUser);

        // Act
        var result = await _userService.GetUserInfoAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(expectedUser.Id, result.Id);
        Assert.Equal(expectedUser.DisplayName, result.DisplayName);
        Assert.Equal(expectedUser.Email, result.Email);
    }

    [Fact]
    public async Task GetUserInfoAsync_ShouldReturnNull_WhenGraphServiceReturnsNull()
    {
        // Arrange
        _mockGraphService.Setup(x => x.GetCurrentUserAsync())
                        .ReturnsAsync((UserInfoDto?)null);

        // Act
        var result = await _userService.GetUserInfoAsync();

        // Assert
        Assert.Null(result);
    }
}
