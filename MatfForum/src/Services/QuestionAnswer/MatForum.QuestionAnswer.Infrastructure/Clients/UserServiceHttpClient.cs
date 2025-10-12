using MatForum.QuestionAnswer.Application.Interfaces;
using MatForum.QuestionAnswer.Application.Dtos;
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Net.Http.Json;

namespace MatForum.QuestionAnswer.Infrastructure.Clients
{
    public class UserServiceHttpClient : IUserService
    {
        private readonly HttpClient _httpClient;

        public UserServiceHttpClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> ExistsAsync(Guid userId, CancellationToken cancellationToken)
        {
            // No JWT forwarding needed - services trust internal requests
            var response = await _httpClient.GetAsync($"/api/users/{userId}/exists", cancellationToken);
            return response.IsSuccessStatusCode;
        }

        public async Task<UserDto?> GetByIdAsync(Guid userId)
        {
            // No JWT forwarding needed - services trust internal requests
            var response = await _httpClient.GetAsync($"/api/users/{userId}");
            if (!response.IsSuccessStatusCode)
                return null;

            return await response.Content.ReadFromJsonAsync<UserDto>();
        }
    }
}

