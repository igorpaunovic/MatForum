using MatForum.QuestionAnswer.Application.Interfaces;
using MatForum.QuestionAnswer.Domain.Entities;
using MatForum.QuestionAnswer.Application.Dtos;

namespace MatForum.QuestionAnswer.Application.Services;

public class AnswerService : IAnswerService
{
    private readonly IAnswerRepository _answerRepository;
    private readonly IUserService _userService;

    public AnswerService(IAnswerRepository answerRepository, IUserService userService)
    {
        _answerRepository = answerRepository;
        _userService = userService;
    }

    public async Task<Guid> CreateAnswerAsync(string content, Guid questionId, Guid authorId, Guid? parentAnswerId, CancellationToken cancellationToken)
    {
        // // 1. Validate dependencies
        // if (!await _questionValidator.ExistsAsync(questionId, cancellationToken))
        // {
        //     throw new InvalidOperationException($"Question with ID {questionId} not found.");
        // }

        // 2. Create the domain entity with optional parent
        var answerEntity = Answer.Create(content, questionId, authorId, parentAnswerId);

        // 3. Persist via the repository
        await _answerRepository.Create(answerEntity); 

        // 4. Return the new ID
        return answerEntity.Id;
    }

    public async Task<AnswerDto?> GetAnswerByIdAsync(Guid answerId, CancellationToken cancellationToken)
    {
        var answer = await _answerRepository.GetById(answerId); 
        if (answer == null) return null;
        
        // Fetch author name from UserManagement service
        var user = await _userService.GetByIdAsync(answer.AuthorId);
        var authorName = user != null ? user.Username : "Anonymous";
        
        return new AnswerDto
        {
            Id = answer.Id,
            Content = answer.Content,
            CreatedAt = answer.CreatedAt,
            UpdatedAt = answer.UpdatedAt, 
            QuestionId = answer.QuestionId,
            AuthorId = answer.AuthorId,
            AuthorName = authorName,
            ParentAnswerId = answer.ParentAnswerId
        };
    }

    public async Task<IEnumerable<AnswerDto>> GetAnswersByQuestionIdAsync(Guid questionId, CancellationToken cancellationToken)
    {
        var allAnswers = await _answerRepository.GetByQuestionIdAsync(questionId);
        var answersList = allAnswers.ToList();
        
        // Build threaded structure - only return top-level answers (without parent)
        var topLevelAnswers = answersList.Where(a => a.ParentAnswerId == null);
        
        var result = new List<AnswerDto>();
        foreach (var answer in topLevelAnswers)
        {
            result.Add(await MapToThreadedDto(answer, answersList));
        }
        
        return result;
    }

    private async Task<AnswerDto> MapToThreadedDto(Answer answer, List<Answer> allAnswers)
    {
        // Fetch author name from UserManagement service
        var user = await _userService.GetByIdAsync(answer.AuthorId);
        var authorName = user != null ? user.Username : "Anonymous";
        
        var dto = new AnswerDto
        {
            Id = answer.Id,
            Content = answer.Content,
            CreatedAt = answer.CreatedAt,
            UpdatedAt = answer.UpdatedAt,
            QuestionId = answer.QuestionId,
            AuthorId = answer.AuthorId,
            AuthorName = authorName,
            ParentAnswerId = answer.ParentAnswerId,
            Replies = new List<AnswerDto>()
        };

        // Find all direct replies to this answer
        var replies = allAnswers.Where(a => a.ParentAnswerId == answer.Id);
        foreach (var reply in replies)
        {
            dto.Replies.Add(await MapToThreadedDto(reply, allAnswers));
        }

        return dto;
    }

    public async Task<Guid?> UpdateAnswerAsync(Guid answerId, string content, CancellationToken cancellationToken)
    {
        var answer = await _answerRepository.GetById(answerId);
        if (answer == null) return null;
        answer.Update(content);
        await _answerRepository.Update(answerId, answer);
        return answerId;
    }

    public async Task<bool> DeleteAnswerAsync(Guid answerId, CancellationToken cancellationToken)
    {
        var answer = await _answerRepository.GetById(answerId);
        if (answer == null) return false;
        return await _answerRepository.Delete(answerId);
    }

    public async Task<bool> DeleteAnswersByQuestionIdAsync(Guid questionId, CancellationToken cancellationToken)
    {
        var answers = await _answerRepository.GetByQuestionIdAsync(questionId);
        if (!answers.Any()) return true; // No answers to delete

        foreach (var answer in answers)
        {
            await _answerRepository.Delete(answer.Id);
        }
        return true;
    }

    public async Task<int> GetCountAsync(CancellationToken cancellationToken)
    {
        return await _answerRepository.GetCount();
    }

    public async Task<IEnumerable<AnswerDto>> GetAnswersByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        var userAnswers = await _answerRepository.GetByUserIdAsync(userId);
        
        return userAnswers.Select(answer => new AnswerDto
        {
            Id = answer.Id,
            Content = answer.Content,
            CreatedAt = answer.CreatedAt,
            UpdatedAt = answer.UpdatedAt,
            QuestionId = answer.QuestionId,
            AuthorId = answer.AuthorId,
            ParentAnswerId = answer.ParentAnswerId,
            Replies = new List<AnswerDto>()
        });
    }
}