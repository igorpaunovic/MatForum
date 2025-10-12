namespace MatForum.QuestionAnswer.Application.Interfaces;
using MatForum.QuestionAnswer.Application.Dtos;

public interface IAnswerService
{
    Task<Guid> CreateAnswerAsync(string content, Guid questionId, Guid authorId, Guid? parentAnswerId, CancellationToken cancellationToken);
    Task<AnswerDto?> GetAnswerByIdAsync(Guid answerId, CancellationToken cancellationToken);
    Task<IEnumerable<AnswerDto>> GetAnswersByQuestionIdAsync(Guid questionId, CancellationToken cancellationToken);
    Task<Guid?> UpdateAnswerAsync(Guid answerId, string newContent, CancellationToken cancellationToken);
    Task<bool> DeleteAnswerAsync(Guid answerId, CancellationToken cancellationToken);
    Task<int> GetCountAsync(CancellationToken cancellationToken);
    Task<IEnumerable<AnswerDto>> GetAnswersByUserIdAsync(Guid userId, CancellationToken cancellationToken);
}