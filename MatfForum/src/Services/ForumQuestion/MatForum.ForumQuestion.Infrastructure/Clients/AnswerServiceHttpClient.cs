using System;
using System.Net.Http;
using System.Threading.Tasks;
using MatForum.ForumQuestion.Application.Interfaces;

namespace MatForum.ForumQuestion.Infrastructure.Clients
{
    public class AnswerServiceHttpClient : IAnswerServiceClient
    {
        private readonly HttpClient _httpClient;

        public AnswerServiceHttpClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> DeleteAnswersByQuestionIdAsync(Guid questionId)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"api/answers/by-question/{questionId}");
                return response.IsSuccessStatusCode;
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error deleting answers by question ID: {ex.Message}");
                return false;
            }
        }
    }
}
