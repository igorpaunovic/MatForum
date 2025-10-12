using MatForum.Shared.Domain.Interfaces; 
using MatForum.ForumQuestion.Domain.Entities;

namespace MatForum.ForumQuestion.Application.Interfaces
{
    public interface IQuestionRepository : IGenericRepository<Question>
    {
        Task<IEnumerable<Question>> SearchQuestions(string searchTerm);
        Task<IEnumerable<Question>> GetSimilarQuestions(Guid questionId, int count = 3);
    }
}