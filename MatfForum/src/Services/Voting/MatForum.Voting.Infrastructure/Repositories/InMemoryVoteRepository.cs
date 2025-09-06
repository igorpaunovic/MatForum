using MatForum.Voting.Application.Interfaces;
using MatForum.Voting.Domain.Entities;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MatForum.Voting.Infrastructure.Repositories
{
    public class InMemoryVoteRepository : IVoteRepository
    {
        // Thread-safe dictionary to store votes in memory
        private static readonly ConcurrentDictionary<Guid, Vote> _votes = new ConcurrentDictionary<Guid, Vote>();

        public Task<Vote> GetByIdAsync(Guid id)
        {
            _votes.TryGetValue(id, out var vote);
            return Task.FromResult(vote);
        }

        public Task<Vote> GetByQuestionAndUserAsync(Guid questionId, Guid userId)
        {
            var vote = _votes.Values.FirstOrDefault(v => v.QuestionId == questionId && v.UserId == userId);
            return Task.FromResult(vote);
        }

        public Task<IEnumerable<Vote>> GetByQuestionIdAsync(Guid questionId)
        {
            var votes = _votes.Values.Where(v => v.QuestionId == questionId).ToList();
            return Task.FromResult<IEnumerable<Vote>>(votes);
        }

        public Task<IEnumerable<Vote>> GetByUserIdAsync(Guid userId)
        {
            var votes = _votes.Values.Where(v => v.UserId == userId).ToList();
            return Task.FromResult<IEnumerable<Vote>>(votes);
        }

        public Task AddAsync(Vote vote)
        {
            if (vote == null) throw new ArgumentNullException(nameof(vote));
            if (!_votes.TryAdd(vote.Id, vote))
            {
                throw new InvalidOperationException($"Vote with ID {vote.Id} already exists.");
            }
            return Task.CompletedTask;
        }

        public Task UpdateAsync(Vote vote)
        {
            if (vote == null) throw new ArgumentNullException(nameof(vote));
            _votes.AddOrUpdate(vote.Id, vote, (key, existingVal) => vote);
            return Task.CompletedTask;
        }

        public Task DeleteAsync(Vote vote)
        {
            if (vote == null) throw new ArgumentNullException(nameof(vote));
            _votes.TryRemove(vote.Id, out _);
            return Task.CompletedTask;
        }

        public Task<bool> ExistsAsync(Guid questionId, Guid userId)
        {
            var exists = _votes.Values.Any(v => v.QuestionId == questionId && v.UserId == userId);
            return Task.FromResult(exists);
        }
    }
}

