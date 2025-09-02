using MatForum.Shared.Domain.Interfaces; 
using MatForum.ForumQuestion.Domain.Entities;

namespace MatForum.ForumQuestion.Application.Interfaces
{
    public interface IQuestionRepository : IGenericRepository<Question>
    {
    }
}