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
    }
}