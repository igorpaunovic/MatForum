using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using MatForum.ForumQuestion.Application.DTOs;
using MatForum.ForumQuestion.Application.Interfaces;

namespace MatForum.ForumQuestion.Infrastructure.Clients
{
    public class UserServiceHttpClient : IUserService
    {
        private readonly HttpClient _httpClient;
        public UserServiceHttpClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<UserDto?> GetByIdAsync(Guid userId)
        {
            var response = await _httpClient.GetAsync($"/api/users/{userId}");
            if (!response.IsSuccessStatusCode)
                return null;

            var rawJson = await response.Content.ReadAsStringAsync();

            // Try to deserialize
            return await response.Content.ReadFromJsonAsync<UserDto>();
        }

        public async Task<bool> ExistsAsync(Guid userId)
        {
            var response = await _httpClient.GetAsync($"/users/{userId}/exists");
            response.EnsureSuccessStatusCode();
            var exists = await response.Content.ReadAsStringAsync();
            return bool.TryParse(exists, out var result) && result;
        }
    }
}