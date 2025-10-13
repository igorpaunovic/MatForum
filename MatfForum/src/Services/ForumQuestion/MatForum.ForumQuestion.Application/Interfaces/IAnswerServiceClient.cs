using System;
using System.Threading.Tasks;

namespace MatForum.ForumQuestion.Application.Interfaces
{
    public interface IAnswerServiceClient
    {
        Task<bool> DeleteAnswersByQuestionIdAsync(Guid questionId);
    }
}
