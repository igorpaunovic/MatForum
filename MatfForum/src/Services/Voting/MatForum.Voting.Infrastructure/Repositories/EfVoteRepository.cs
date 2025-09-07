using Microsoft.EntityFrameworkCore;
using MatForum.Voting.Application.Interfaces;
using MatForum.Voting.Domain.Entities;
using MatForum.Voting.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MatForum.Voting.Infrastructure.Repositories
{
    public class EfVoteRepository : IVoteRepository
    {
        private readonly VotingDbContext _context;

        public EfVoteRepository(VotingDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<Vote> GetByIdAsync(Guid id)
        {
            return await _context.Votes
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<Vote> GetByQuestionAndUserAsync(Guid questionId, Guid userId)
        {
            return await _context.Votes
                .FirstOrDefaultAsync(v => v.QuestionId == questionId && v.UserId == userId);
        }

        public async Task<IEnumerable<Vote>> GetByQuestionIdAsync(Guid questionId)
        {
            return await _context.Votes
                .Where(v => v.QuestionId == questionId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Vote>> GetByUserIdAsync(Guid userId)
        {
            return await _context.Votes
                .Where(v => v.UserId == userId)
                .ToListAsync();
        }

        public async Task AddAsync(Vote vote)
        {
            if (vote == null) throw new ArgumentNullException(nameof(vote));
            
            _context.Votes.Add(vote);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Vote vote)
        {
            if (vote == null) throw new ArgumentNullException(nameof(vote));
            
            _context.Votes.Update(vote);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Vote vote)
        {
            if (vote == null) throw new ArgumentNullException(nameof(vote));
            
            _context.Votes.Remove(vote);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(Guid questionId, Guid userId)
        {
            return await _context.Votes
                .AnyAsync(v => v.QuestionId == questionId && v.UserId == userId);
        }
    }
}
