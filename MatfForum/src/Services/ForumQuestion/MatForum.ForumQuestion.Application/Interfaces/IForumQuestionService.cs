using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MatForum.ForumQuestion.Application.DTOs;

namespace MatForum.ForumQuestion.Application.Interfaces
{
    public interface IForumQuestionService
    {
        Task<QuestionDto> CreateQuestionAsync(CreateQuestionCommand command);
        Task<QuestionDto> GetQuestionByIdAsync(Guid id);
        Task<IEnumerable<QuestionDto>> GetAllQuestionsAsync();
        Task<bool> UpdateQuestionAsync(UpdateQuestionCommand command);
        Task<bool> DeleteQuestionAsync(Guid id);
    }
}