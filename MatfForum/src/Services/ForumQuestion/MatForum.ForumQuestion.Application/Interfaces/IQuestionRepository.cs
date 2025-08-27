using MatForum.Shared.Domain.Interfaces; // Assuming this is the namespace for IGenericRepository
using MatForum.ForumQuestion.Domain.Entities;

namespace MatForum.ForumQuestion.Application.Interfaces
{
    public interface IQuestionRepository : IGenericRepository<Question>
    {
    }
}