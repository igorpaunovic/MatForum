using MatForum.ForumQuestion.Application.Interfaces;
using MatForum.ForumQuestion.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace MatForum.ForumQuestion.Infrastructure
{
    // This client implements the same IForumQuestionService interface
    // that the internal service implements. This allows you to easily swap
    // between an in-process service and a remote HTTP service.
    public class QuestionServiceHttpClient : IForumQuestionService
    {
        private readonly HttpClient _httpClient;

        public QuestionServiceHttpClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<QuestionDto> CreateQuestion(CreateQuestionCommand command)
        {
            var jsonContent = new StringContent(JsonSerializer.Serialize(command), System.Text.Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("api/questions", jsonContent);
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<QuestionDto>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<QuestionDto?> GetQuestionById(Guid id)
        {
            var response = await _httpClient.GetAsync($"api/questions/{id}");
            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                return null;
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<QuestionDto>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<IEnumerable<QuestionDto>> GetAllQuestions()
        {
            var response = await _httpClient.GetAsync("api/questions");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<IEnumerable<QuestionDto>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<IEnumerable<QuestionDto>> SearchQuestions(string searchTerm)
        {
            var response = await _httpClient.GetAsync($"api/questions/search?searchTerm={Uri.EscapeDataString(searchTerm)}");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<IEnumerable<QuestionDto>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<bool> UpdateQuestion(UpdateQuestionCommand command)
        {
            var jsonContent = new StringContent(JsonSerializer.Serialize(command), System.Text.Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync($"api/questions/{command.Id}", jsonContent);
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> DeleteQuestion(Guid id)
        {
            var response = await _httpClient.DeleteAsync($"api/questions/{id}");
            return response.IsSuccessStatusCode;
        }

        public async Task<IEnumerable<QuestionDto>> GetSimilarQuestions(Guid questionId, int count = 3)
        {
            var response = await _httpClient.GetAsync($"api/questions/{questionId}/similar?count={count}");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<IEnumerable<QuestionDto>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<int> GetCount()
        {
            try
            {
                var response = await _httpClient.GetAsync("api/questions/count");
                response.EnsureSuccessStatusCode();
                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<int>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error retrieving question count: {ex.Message}");
                return 0;
            }
        }

        public async Task<IEnumerable<QuestionDto>> GetQuestionsByUserId(Guid userId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"api/questions/by-user/{userId}");
                response.EnsureSuccessStatusCode();
                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<IEnumerable<QuestionDto>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<QuestionDto>();
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error retrieving questions by user: {ex.Message}");
                return new List<QuestionDto>();
            }
        }
    }
}
