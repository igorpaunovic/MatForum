using MatForum.QuestionAnswer.Application.Interfaces;
using MatForum.QuestionAnswer.Domain.Entities;
using MatForum.QuestionAnswer.Application.Dtos;

namespace MatForum.QuestionAnswer.Application.Services;

public class AnswerService : IAnswerService
{
    private readonly IAnswerRepository _answerRepository;
    // private readonly IQuestionValidator _questionValidator;
    // You would inject IUserValidator here as well

    public AnswerService(IAnswerRepository answerRepository)
    {
        _answerRepository = answerRepository;
        // _questionValidator = questionValidator;
    }

    public async Task<Guid> CreateAnswerAsync(string content, Guid questionId, Guid authorId, CancellationToken cancellationToken)
    {
        // // 1. Validate dependencies
        // if (!await _questionValidator.ExistsAsync(questionId, cancellationToken))
        // {
        //     throw new InvalidOperationException($"Question with ID {questionId} not found.");
        // }

        // 2. Create the domain entity
        var answerEntity = Answer.Create(content, questionId, authorId);

        // 3. Persist via the repository
        await _answerRepository.AddAsync(answerEntity, cancellationToken);

        // 4. Return the new ID
        return answerEntity.Id;
    }

    public async Task<AnswerDto?> GetAnswerByIdAsync(Guid answerId, CancellationToken cancellationToken)
    {
        var answer = await _answerRepository.GetByIdAsync(answerId, cancellationToken);
        if (answer == null) return null;
        return new AnswerDto
        {
            Id = answer.Id,
            Content = answer.Content,
            CreatedAt = answer.CreatedAt,
            QuestionId = answer.QuestionId,
            AuthorId = answer.AuthorId
        };
    }

    public async Task<IEnumerable<AnswerDto>> GetAnswersByQuestionIdAsync(Guid questionId, CancellationToken cancellationToken)
    {
        var answers = await _answerRepository.GetByQuestionIdAsync(questionId, cancellationToken);
        return answers.Select(answer => new AnswerDto
        {
            Id = answer.Id,
            Content = answer.Content,
            CreatedAt = answer.CreatedAt,
            QuestionId = answer.QuestionId,
            AuthorId = answer.AuthorId
        });
    }
}