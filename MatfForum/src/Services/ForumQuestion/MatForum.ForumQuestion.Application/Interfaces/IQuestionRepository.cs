using MatForum.ForumQuestion.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace MatForum.ForumQuestion.Application.Interfaces
{
    public interface IQuestionRepository
    {
        Task<Question> GetByIdAsync(Guid id);
        Task<IEnumerable<Question>> GetAllAsync();
        Task AddAsync(Question question);
        Task UpdateAsync(Question question);
        Task DeleteAsync(Question question);
    }
}