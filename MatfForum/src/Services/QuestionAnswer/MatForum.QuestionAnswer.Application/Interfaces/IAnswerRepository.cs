using MatForum.QuestionAnswer.Domain.Entities;

namespace MatForum.QuestionAnswer.Application.Interfaces;

public interface IAnswerRepository
{
    Task AddAsync(Answer answer, CancellationToken cancellationToken);
    Task<Answer?> GetByIdAsync(Guid answerId, CancellationToken cancellationToken);
    Task<IEnumerable<Answer>> GetByQuestionIdAsync(Guid questionId, CancellationToken cancellationToken);
}