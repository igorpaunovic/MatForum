using Microsoft.EntityFrameworkCore;
using MatForum.ForumQuestion.Application.Interfaces;
using MatForum.ForumQuestion.Domain.Entities;
using MatForum.ForumQuestion.Infrastructure.Data;
using MatForum.Shared.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MatForum.ForumQuestion.Infrastructure.Repositories
{
    public class EfQuestionRepository : IQuestionRepository, IGenericRepository<Question>
    {
        private readonly QuestionDbContext _context;

        public EfQuestionRepository(QuestionDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<Question> GetByIdAsync(Guid id)
        {
            return await _context.Questions
                .Where(q => !q.IsDeleted)
                .FirstOrDefaultAsync(q => q.Id == id);
        }

        public async Task<IEnumerable<Question>> GetAllAsync()
        {
            return await _context.Questions
                .Where(q => !q.IsDeleted)
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();
        }

        public async Task AddAsync(Question question)
        {
            if (question == null) throw new ArgumentNullException(nameof(question));
            
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Question question)
        {
            if (question == null) throw new ArgumentNullException(nameof(question));
            
            _context.Questions.Update(question);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Question question)
        {
            if (question == null) throw new ArgumentNullException(nameof(question));
            
            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Question>> GetByUserIdAsync(Guid userId)
        {
            return await _context.Questions
                .Where(q => !q.IsDeleted && q.CreatedByUserId == userId)
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Question>> GetByTagAsync(string tag)
        {
            return await _context.Questions
                .Where(q => !q.IsDeleted && q.Tags.Contains(tag.ToLowerInvariant()))
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Question>> GetClosedQuestionsAsync()
        {
            return await _context.Questions
                .Where(q => !q.IsDeleted && q.IsClosed)
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Question>> GetOpenQuestionsAsync()
        {
            return await _context.Questions
                .Where(q => !q.IsDeleted && !q.IsClosed)
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();
        }

        // IGenericRepository<Question> implementation
        public async Task<Question?> GetById(Guid id)
        {
            return await _context.Questions
                .Where(q => !q.IsDeleted)
                .FirstOrDefaultAsync(q => q.Id == id);
        }

        public async Task<IEnumerable<Question>> GetAll()
        {
            return await _context.Questions
                .Where(q => !q.IsDeleted)
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();
        }

        public async Task<Question> Create(Question entity)
        {
            if (entity == null) throw new ArgumentNullException(nameof(entity));
            
            _context.Questions.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<Question?> Update(Guid id, Question entity)
        {
            if (entity == null) throw new ArgumentNullException(nameof(entity));
            
            var existingQuestion = await _context.Questions.FindAsync(id);
            if (existingQuestion == null)
                return null;

            // Update properties
            existingQuestion.Update(entity.Title, entity.Content, entity.Tags);
            
            await _context.SaveChangesAsync();
            return existingQuestion;
        }

        public async Task<bool> Delete(Guid id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
                return false;

            // Soft delete
            question.Delete();
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Question>> SearchQuestions(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return await GetAllAsync();
            }

            var lowerSearchTerm = searchTerm.ToLower();
            
            return await _context.Questions
                .Where(q => !q.IsDeleted && 
                           (q.Title.ToLower().Contains(lowerSearchTerm) || 
                            q.Content.ToLower().Contains(lowerSearchTerm) ||
                            q.Tags.Any(tag => tag.ToLower().Contains(lowerSearchTerm))))
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Question>> GetSimilarQuestions(Guid questionId, int count = 3)
        {
            var targetQuestion = await GetById(questionId);
            if (targetQuestion == null || !targetQuestion.Tags.Any())
            {
                return Enumerable.Empty<Question>();
            }

            var allQuestions = await _context.Questions
                .Where(q => !q.IsDeleted && q.Id != questionId && q.Tags.Any())
                .ToListAsync();
            
            // Calculate similarity score based on tag overlap
            var similarQuestions = allQuestions
                .Select(q => new
                {
                    Question = q,
                    Score = q.Tags.Intersect(targetQuestion.Tags, StringComparer.OrdinalIgnoreCase).Count()
                })
                .Where(x => x.Score > 0)
                .OrderByDescending(x => x.Score)
                .ThenByDescending(x => x.Question.Views)
                .Take(count)
                .Select(x => x.Question);

            return similarQuestions;
        }

        public async Task<int> GetCount()
        {
            return await _context.Questions
                .Where(q => !q.IsDeleted)
                .CountAsync();
        }
    }
}
