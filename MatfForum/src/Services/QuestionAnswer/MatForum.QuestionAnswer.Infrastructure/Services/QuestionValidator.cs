using MatForum.QuestionAnswer.Application.Interfaces;
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace MatForum.QuestionAnswer.Infrastructure.Services
{
    public class QuestionValidator : IQuestionValidator
    {
        private readonly HttpClient _httpClient;

        public QuestionValidator(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> ExistsAsync(Guid questionId, CancellationToken cancellationToken)
        {
            // No JWT forwarding needed - services trust internal requests
            var response = await _httpClient.GetAsync($"/api/questions/{questionId}/exists", cancellationToken);
            return response.IsSuccessStatusCode;
        }
    }
}
