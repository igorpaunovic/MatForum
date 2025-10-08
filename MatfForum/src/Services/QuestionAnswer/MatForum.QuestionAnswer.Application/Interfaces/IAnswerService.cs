namespace MatForum.QuestionAnswer.Application.Interfaces;
using MatForum.QuestionAnswer.Application.Dtos;

public interface IAnswerService
{
    Task<Guid> CreateAnswerAsync(string content, Guid questionId, Guid authorId, CancellationToken cancellationToken);
    Task<AnswerDto?> GetAnswerByIdAsync(Guid answerId, CancellationToken cancellationToken);
    Task<IEnumerable<AnswerDto>> GetAnswersByQuestionIdAsync(Guid questionId, CancellationToken cancellationToken);
    Task<Guid?> UpdateAnswerAsync(Guid answerId, string newContent, CancellationToken cancellationToken);
    Task<bool> DeleteAnswerAsync(Guid answerId, CancellationToken cancellationToken);
}