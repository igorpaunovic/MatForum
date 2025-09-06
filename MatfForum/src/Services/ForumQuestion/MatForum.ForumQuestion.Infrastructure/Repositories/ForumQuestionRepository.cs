using MatForum.ForumQuestion.Application.Interfaces;
using MatForum.ForumQuestion.Domain.Entities;
using MatForum.Shared.Infrastructure.Repositories;

namespace MatForum.ForumQuestion.Infrastructure.Repositories
{

    public class QuestionRepository : GenericRepository<Question>, IQuestionRepository
    {

    }
}