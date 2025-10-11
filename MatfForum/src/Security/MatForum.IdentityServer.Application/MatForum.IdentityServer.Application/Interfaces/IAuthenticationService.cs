using MatForum.IdentityServer.Application.DTOs;
using MatForum.IdentityServer.Domain.Entities;

namespace MatForum.IdentityServer.Application.Interfaces
{
    public interface IAuthenticationService
    {
        Task<AppUser?> ValidateUser(UserCredentialsDto userCredentials);
        Task<AuthenticationModel> CreateAuthenticationModel(AppUser user);
        Task RemoveRefreshToken(AppUser user, string refreshToken);
    }
}
