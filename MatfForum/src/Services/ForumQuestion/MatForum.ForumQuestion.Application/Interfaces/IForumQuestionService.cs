using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MatForum.ForumQuestion.Application.DTOs;

namespace MatForum.ForumQuestion.Application.Interfaces
{
    public interface IForumQuestionService
    {
        Task<QuestionDto> CreateQuestion(CreateQuestionCommand command);
        Task<QuestionDto> GetQuestionById(Guid id);
        Task<IEnumerable<QuestionDto>> GetAllQuestions();
        Task<bool> UpdateQuestion(UpdateQuestionCommand command);
        Task<bool> DeleteQuestion(Guid id);
    }
}