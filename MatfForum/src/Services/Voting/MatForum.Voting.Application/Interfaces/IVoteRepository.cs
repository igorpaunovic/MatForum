using MatForum.Voting.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MatForum.Voting.Application.Interfaces
{
    public interface IVoteRepository
    {
        Task<Vote> GetByIdAsync(Guid id);
        Task<Vote> GetByQuestionAndUserAsync(Guid questionId, Guid userId);
        Task<Vote> GetByAnswerAndUserAsync(Guid answerId, Guid userId);
        Task<IEnumerable<Vote>> GetByQuestionIdAsync(Guid questionId);
        Task<IEnumerable<Vote>> GetByAnswerIdAsync(Guid answerId);
        Task<IEnumerable<Vote>> GetByUserIdAsync(Guid userId);
        Task AddAsync(Vote vote);
        Task UpdateAsync(Vote vote);
        Task DeleteAsync(Vote vote);
        Task<bool> ExistsForQuestionAsync(Guid questionId, Guid userId);
        Task<bool> ExistsForAnswerAsync(Guid answerId, Guid userId);
    }
}

