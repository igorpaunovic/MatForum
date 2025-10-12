using MatForum.UserManagement.Application.DTOs;
using MatForum.UserManagement.Application.Interfaces;
using MatForum.UserManagement.Domain.Entities;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;
using System.Text.Json;

namespace MatForum.UserManagement.Infrastructure.Clients
{
    public class UserProfileServiceHttpClient : IUserProfileService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<UserProfileServiceHttpClient> _logger;

        public UserProfileServiceHttpClient(HttpClient httpClient, ILogger<UserProfileServiceHttpClient> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<UserProfile?> GetById(Guid id)
        {
            var response = await _httpClient.GetAsync($"/api/users/{id}");
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Failed to get user {UserId}. Status: {StatusCode}", id, response.StatusCode);
                return null;
            }
            return await response.Content.ReadFromJsonAsync<UserProfile>();
        }

        public async Task<IEnumerable<UserProfileDto>> GetAll()
        {
            var response = await _httpClient.GetAsync("/api/users");
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Failed to get all users. Status: {StatusCode}", response.StatusCode);
                return new List<UserProfileDto>();
            }
            return await response.Content.ReadFromJsonAsync<IEnumerable<UserProfileDto>>() ?? new List<UserProfileDto>();
        }

        public async Task<UserProfile> Create(CreateUserProfileDto createUserDto)
        {
            var response = await _httpClient.PostAsJsonAsync("/api/users", createUserDto);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<UserProfile>()
                ?? throw new InvalidOperationException("Failed to create user profile");
        }

        public async Task<UserProfile?> Update(Guid id, UpdateUserProfileDto updateUserDto)
        {
            var response = await _httpClient.PatchAsJsonAsync($"/api/users/{id}", updateUserDto);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Failed to update user {UserId}. Status: {StatusCode}", id, response.StatusCode);
                return null;
            }
            return await response.Content.ReadFromJsonAsync<UserProfile>();
        }

        public async Task<bool> Delete(Guid id)
        {
            var response = await _httpClient.DeleteAsync($"/api/users/{id}");
            return response.IsSuccessStatusCode;
        }


        public async Task<int> GetCount()
        {
            try
            {
                var response = await _httpClient.GetAsync("api/users/count");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var count = JsonSerializer.Deserialize<int>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                return count;
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error retrieving user count: {ex.Message}");
                return 0;
            }
        }

        public async Task<IEnumerable<Application.DTOs.TopContributorDto>> GetTopContributors(int count = 10)
        {
            try
            {
                var response = await _httpClient.GetAsync($"api/users/top-contributors?count={count}");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var contributors = JsonSerializer.Deserialize<IEnumerable<Application.DTOs.TopContributorDto>>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                return contributors ?? new List<Application.DTOs.TopContributorDto>();
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error retrieving top contributors: {ex.Message}");
                return new List<Application.DTOs.TopContributorDto>();
            }
        }

        public async Task<Application.DTOs.ContributorProfileDto?> GetContributorProfile(Guid userId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"api/users/{userId}/contributor-profile");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var profile = JsonSerializer.Deserialize<Application.DTOs.ContributorProfileDto>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                return profile;
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error retrieving contributor profile: {ex.Message}");
                return null;
            }
        }
    }
}