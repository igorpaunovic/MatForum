using MatForum.ForumQuestion.Application.Interfaces;
using MatForum.ForumQuestion.Domain.Entities;
using System;
using System.Collections.Concurrent; // For thread-safe in-memory store
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MatForum.ForumQuestion.Infrastructure.Repositories
{
    // Important: Rename this to InMemoryQuestionRepository.cs
    public class InMemoryQuestionRepository : IQuestionRepository
    {
        // Thread-safe dictionary to store questions in memory
        private static readonly ConcurrentDictionary<Guid, Question> _questions = new ConcurrentDictionary<Guid, Question>();

        public Task<Question> GetByIdAsync(Guid id)
        {
            _questions.TryGetValue(id, out var question);
            return Task.FromResult(question);
        }

        public Task<IEnumerable<Question>> GetAllAsync()
        {
            return Task.FromResult<IEnumerable<Question>>(_questions.Values.ToList());
        }

        public Task AddAsync(Question question)
        {
            if (question == null) throw new ArgumentNullException(nameof(question));
            if (!_questions.TryAdd(question.Id, question))
            {
                // Handle case where ID already exists, though Guid.NewGuid() makes this rare
                throw new InvalidOperationException($"Question with ID {question.Id} already exists.");
            }
            return Task.CompletedTask;
        }

        public Task UpdateAsync(Question question)
        {
            if (question == null) throw new ArgumentNullException(nameof(question));
            _questions.AddOrUpdate(question.Id, question, (key, existingVal) => question);
            return Task.CompletedTask;
        }

        public Task DeleteAsync(Question question)
        {
            if (question == null) throw new ArgumentNullException(nameof(question));
            _questions.TryRemove(question.Id, out _);
            return Task.CompletedTask;
        }
    }
}