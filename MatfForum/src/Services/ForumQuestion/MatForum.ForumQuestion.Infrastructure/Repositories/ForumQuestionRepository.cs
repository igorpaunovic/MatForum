using MatForum.ForumQuestion.Application.Interfaces;
using MatForum.ForumQuestion.Domain.Entities;
using MatForum.Shared.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MatForum.ForumQuestion.Infrastructure.Repositories
{

    public class QuestionRepository : GenericRepository<Question>, IQuestionRepository
    {
        public async Task<IEnumerable<Question>> SearchQuestions(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return await GetAll();
            }

            var allQuestions = await GetAll();
            var lowerSearchTerm = searchTerm.ToLower();
            
            return allQuestions.Where(q => 
                !q.IsDeleted &&
                (q.Title.ToLower().Contains(lowerSearchTerm) || 
                q.Content.ToLower().Contains(lowerSearchTerm) ||
                q.Tags.Any(tag => tag.ToLower().Contains(lowerSearchTerm)))
            ).OrderByDescending(q => q.CreatedAt);
        }

        public async Task<IEnumerable<Question>> GetSimilarQuestions(Guid questionId, int count = 3)
        {
            var targetQuestion = await GetById(questionId);
            if (targetQuestion == null || !targetQuestion.Tags.Any())
            {
                return Enumerable.Empty<Question>();
            }

            var allQuestions = await GetAll();
            
            // Calculate similarity score based on tag overlap
            var similarQuestions = allQuestions
                .Where(q => !q.IsDeleted && q.Id != questionId && q.Tags.Any())
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
    }
}