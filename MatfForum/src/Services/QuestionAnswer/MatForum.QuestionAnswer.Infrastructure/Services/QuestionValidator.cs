using MatForum.QuestionAnswer.Application.Interfaces;
using MatForum.ForumQuestion.GRPC;
using Grpc.Core;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace MatForum.QuestionAnswer.Infrastructure.Services
{
    public class QuestionValidator : IQuestionValidator
    {
        private readonly QuestionValidationService.QuestionValidationServiceClient _grpcClient;
        private readonly ILogger<QuestionValidator> _logger;

        public QuestionValidator(
            QuestionValidationService.QuestionValidationServiceClient grpcClient,
            ILogger<QuestionValidator> logger)
        {
            _grpcClient = grpcClient ?? throw new ArgumentNullException(nameof(grpcClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<bool> ExistsAsync(Guid questionId, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation("Validating question via gRPC: {QuestionId}", questionId);

                var request = new ValidateQuestionRequest
                {
                    QuestionId = questionId.ToString()
                };

                var response = await _grpcClient.ValidateQuestionAsync(request, cancellationToken: cancellationToken);

                _logger.LogInformation(
                    "Question validation result - QuestionId: {QuestionId}, Exists: {Exists}, IsActive: {IsActive}, Message: {Message}",
                    questionId, response.Exists, response.IsActive, response.Message);

                // Question must exist AND be active (not deleted)
                return response.Exists && response.IsActive;
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "gRPC error while validating question {QuestionId}", questionId);
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while validating question {QuestionId}", questionId);
                return false;
            }
        }
    }
}
