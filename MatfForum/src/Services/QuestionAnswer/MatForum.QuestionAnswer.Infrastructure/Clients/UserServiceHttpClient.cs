using MatForum.QuestionAnswer.Application.Interfaces;
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

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
            var response = await _httpClient.GetAsync($"/api/users/{userId}/exists", cancellationToken);
            return response.IsSuccessStatusCode;
        }
    }
}

