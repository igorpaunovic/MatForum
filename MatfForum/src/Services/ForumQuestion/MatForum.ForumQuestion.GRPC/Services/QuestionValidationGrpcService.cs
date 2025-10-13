using Grpc.Core;
using MatForum.ForumQuestion.Application.Interfaces;

namespace MatForum.ForumQuestion.GRPC.Services;

public class QuestionValidationGrpcService : QuestionValidationService.QuestionValidationServiceBase
{
    private readonly IQuestionRepository _questionRepository;
    private readonly ILogger<QuestionValidationGrpcService> _logger;

    public QuestionValidationGrpcService(
        IQuestionRepository questionRepository,
        ILogger<QuestionValidationGrpcService> logger)
    {
        _questionRepository = questionRepository ?? throw new ArgumentNullException(nameof(questionRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public override async Task<ValidateQuestionResponse> ValidateQuestion(
        ValidateQuestionRequest request,
        ServerCallContext context)
    {
        _logger.LogInformation("gRPC ValidateQuestion called for QuestionId: {QuestionId}", request.QuestionId);

        // Parse questionId from string to Guid
        if (!Guid.TryParse(request.QuestionId, out var questionId))
        {
            _logger.LogWarning("Invalid QuestionId format: {QuestionId}", request.QuestionId);
            return new ValidateQuestionResponse
            {
                Exists = false,
                IsActive = false,
                Message = "Invalid question ID format"
            };
        }

        // Check if question exists
        var question = await _questionRepository.GetById(questionId);
        
        if (question == null)
        {
            _logger.LogWarning("Question not found: {QuestionId}", questionId);
            return new ValidateQuestionResponse
            {
                Exists = false,
                IsActive = false,
                Message = $"Question with ID {questionId} not found"
            };
        }

        // Check if question is deleted
        if (question.IsDeleted)
        {
            _logger.LogWarning("Question is deleted: {QuestionId}", questionId);
            return new ValidateQuestionResponse
            {
                Exists = true,
                IsActive = false,
                Message = $"Question with ID {questionId} has been deleted"
            };
        }

        _logger.LogInformation("Question is valid and active: {QuestionId}", questionId);
        return new ValidateQuestionResponse
        {
            Exists = true,
            IsActive = true,
            Message = "Question is valid and active"
        };
    }
}

