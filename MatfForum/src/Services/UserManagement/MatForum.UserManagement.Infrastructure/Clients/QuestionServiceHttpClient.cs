using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using MatForum.UserManagement.Application.Interfaces;

namespace MatForum.UserManagement.Infrastructure.Clients
{
    public class QuestionServiceHttpClient : IQuestionServiceClient
    {
        private readonly HttpClient _httpClient;

        public QuestionServiceHttpClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<int> GetQuestionCountByUserIdAsync(Guid userId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"api/questions/count-by-user/{userId}");
                response.EnsureSuccessStatusCode();
                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<int>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error retrieving question count by user: {ex.Message}");
                return 0;
            }
        }

        public async Task<IEnumerable<Application.Interfaces.QuestionDto>> GetQuestionsByUserIdAsync(Guid userId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"api/questions/by-user/{userId}");
                response.EnsureSuccessStatusCode();
                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<IEnumerable<Application.Interfaces.QuestionDto>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<Application.Interfaces.QuestionDto>();
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error retrieving questions by user: {ex.Message}");
                return new List<Application.Interfaces.QuestionDto>();
            }
        }
    }
}

