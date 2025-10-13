using MatForum.QuestionAnswer.Domain.Entities;
using MatForum.Shared.Domain.Interfaces;

namespace MatForum.QuestionAnswer.Application.Interfaces;

public interface IAnswerRepository : IGenericRepository<Answer>
{
    Task<IEnumerable<Answer>> GetByQuestionIdAsync(Guid questionId);
    Task<IEnumerable<Answer>> GetByUserIdAsync(Guid userId);
}