using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace MatForum.IdentityServer.Infrastructure.Clients
{
    public class UserManagementHttpClient
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<UserManagementHttpClient> _logger;

        public UserManagementHttpClient(HttpClient httpClient, ILogger<UserManagementHttpClient> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<bool> CreateUserProfileAsync(Guid userId, string firstName, string lastName, string email, string username, string? phoneNumber = null)
        {
            try
            {
                // Create user profile DTO
                var createUserProfileDto = new
                {
                    Id = userId, // Use the SAME GUID from IdentityServer
                    FirstName = firstName,
                    LastName = lastName,
                    Email = email,
                    Username = username,
                    PhoneNumber = phoneNumber ?? "", // Optional - user can provide or leave empty
                    DateOfBirth = DateTime.UtcNow.AddYears(-25) // Default age, can be updated later
                };

                var json = JsonSerializer.Serialize(createUserProfileDto);
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync("api/users", content);
                
                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("Successfully created user profile for {Username}", username);
                    return true;
                }
                else
                {
                    _logger.LogWarning("Failed to create user profile for {Username}. Status: {Status}", 
                        username, response.StatusCode);
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user profile for {Username}", username);
                return false;
            }
        }
    }
}
