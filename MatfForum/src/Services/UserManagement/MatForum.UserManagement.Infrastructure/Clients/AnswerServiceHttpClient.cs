using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using MatForum.UserManagement.Application.Interfaces;

namespace MatForum.UserManagement.Infrastructure.Clients
{
    public class AnswerServiceHttpClient : IAnswerServiceClient
    {
        private readonly HttpClient _httpClient;

        public AnswerServiceHttpClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<int> GetAnswerCountByUserIdAsync(Guid userId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"api/answers/count-by-user/{userId}");
                response.EnsureSuccessStatusCode();
                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<int>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error retrieving answer count by user: {ex.Message}");
                return 0;
            }
        }
    }
}

