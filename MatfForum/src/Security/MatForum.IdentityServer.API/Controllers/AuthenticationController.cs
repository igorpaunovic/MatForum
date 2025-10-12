using AutoMapper;
using MatForum.IdentityServer.API.Controllers.Base;
using MatForum.IdentityServer.Application.DTOs;
using MatForum.IdentityServer.Domain.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Data;

using MatForum.IdentityServer.Application.Interfaces;
using MatForum.IdentityServer.Infrastructure.Clients;

namespace MatForum.IdentityServer.API.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class AuthenticationController : RegistrationControllerBase
    {
        private readonly IAuthenticationService _authService;
        private readonly UserManagementHttpClient _userManagementClient;

        public AuthenticationController(ILogger<AuthenticationController> logger, IMapper mapper,
            UserManager<AppUser> userManager, RoleManager<IdentityRole<Guid>> roleManager, IAuthenticationService authService, UserManagementHttpClient userManagementClient) : base(logger, mapper, userManager, roleManager)
        {
            _authService = authService ?? throw new ArgumentNullException(nameof(authService));
            _userManagementClient = userManagementClient ?? throw new ArgumentNullException(nameof(userManagementClient));
        }

        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RegisterUser([FromBody] NewUserDto newUser)
        {
            // First, register the user in IdentityServer
            var (result, user) = await RegisterNewUserWithRolesInternal(newUser, new string[] { Roles.DefaulUser });
            
            // If registration was successful, create user profile with SAME GUID
            if (result is StatusCodeResult statusResult && statusResult.StatusCode == 201 && user != null)
            {
                try
                {
                    await _userManagementClient.CreateUserProfileAsync(
                        user.Id, // ← Use the SAME GUID from IdentityServer!
                        newUser.FirstName, 
                        newUser.LastName, 
                        newUser.Email, 
                        newUser.UserName,
                        newUser.PhoneNumber);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to create user profile for {Username}", newUser.UserName);
                    // Don't fail registration if profile creation fails
                }
            }
            
            return result;
        }


        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RegisterAdmin([FromBody] NewUserDto newUser)
        {
            // First, register the user in IdentityServer
            var (result, user) = await RegisterNewUserWithRolesInternal(newUser, new string[] { Roles.Admin });
            
            // If registration was successful, create user profile with SAME GUID
            if (result is StatusCodeResult statusResult && statusResult.StatusCode == 201 && user != null)
            {
                try
                {
                    await _userManagementClient.CreateUserProfileAsync(
                        user.Id, // ← Use the SAME GUID from IdentityServer!
                        newUser.FirstName, 
                        newUser.LastName, 
                        newUser.Email, 
                        newUser.UserName,
                        newUser.PhoneNumber);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to create user profile for admin {Username}", newUser.UserName);
                    // Don't fail registration if profile creation fails
                }
            }
            
            return result;
        }

        [HttpPost("[action]")]
        [ProducesResponseType(typeof(AuthenticationModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] UserCredentialsDto userCredentials)
        {
            var user = await _authService.ValidateUser(userCredentials);
            if (user is null)
            {
                _logger.LogWarning("{Login}: Authentication failed. Wrong username or password.", nameof(Login));
                return Unauthorized();
            }

            return Ok(await _authService.CreateAuthenticationModel(user));
        }
        [HttpPost("[action]")]
        [ProducesResponseType(typeof(AuthenticationModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<AuthenticationModel>> Refresh([FromBody] RefreshTokenModel refreshTokenCredentials)
        {
            var user = await _userManager.FindByNameAsync(refreshTokenCredentials.UserName);
            if (user is null)
            {
                _logger.LogWarning("{Refresh}: Refreshing token failed. Unknown username {UserName}.", nameof(Refresh), refreshTokenCredentials.UserName);
                return Forbid();
            }

            var refreshToken = user.RefreshTokens.FirstOrDefault(r => r.Token == refreshTokenCredentials.RefreshToken);
            if (refreshToken is null)
            {
                _logger.LogWarning("{Refresh}: Refreshing token failed. The refresh token is not found.", nameof(Refresh));
                return Unauthorized();
            }

            if (refreshToken.ExpiryTime < DateTime.UtcNow)
            {
                _logger.LogWarning("{Refresh}: Refreshing token failed. The refresh token is not valid.", nameof(Refresh));
                return Unauthorized();
            }

            return Ok(await _authService.CreateAuthenticationModel(user));
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenModel refreshTokenCredentials)
        {
            var user = await _userManager.FindByNameAsync(refreshTokenCredentials.UserName);
            if (user is null)
            {
                _logger.LogWarning("{Logout}: Logout failed. Unknown username {UserName}.", nameof(Logout), refreshTokenCredentials.UserName);
                return Forbid();
            }

            await _authService.RemoveRefreshToken(user, refreshTokenCredentials.RefreshToken);

            return Accepted();
        }
    }
}
