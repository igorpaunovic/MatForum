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
        Task<IEnumerable<Vote>> GetByQuestionIdAsync(Guid questionId);
        Task<IEnumerable<Vote>> GetByUserIdAsync(Guid userId);
        Task AddAsync(Vote vote);
        Task UpdateAsync(Vote vote);
        Task DeleteAsync(Vote vote);
        Task<bool> ExistsAsync(Guid questionId, Guid userId);
    }
}

