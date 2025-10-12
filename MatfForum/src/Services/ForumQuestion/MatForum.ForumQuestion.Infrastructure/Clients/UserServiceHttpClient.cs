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
            // No JWT forwarding needed - services trust internal requests
            var response = await _httpClient.GetAsync($"/api/users/{userId}");
            if (!response.IsSuccessStatusCode)
                return null;

            return await response.Content.ReadFromJsonAsync<UserDto>();
        }

        public async Task<bool> ExistsAsync(Guid userId)
        {
            // No JWT forwarding needed - services trust internal requests
            var response = await _httpClient.GetAsync($"/api/users/{userId}/exists");
            if (!response.IsSuccessStatusCode)
                return false;

            var exists = await response.Content.ReadAsStringAsync();
            return bool.TryParse(exists, out var result) && result;
        }
    }
}