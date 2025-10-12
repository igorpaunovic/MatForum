using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MatForum.UserManagement.Application.Interfaces
{
    public interface IQuestionServiceClient
    {
        Task<int> GetQuestionCountByUserIdAsync(Guid userId);
        Task<IEnumerable<QuestionDto>> GetQuestionsByUserIdAsync(Guid userId);
    }

    public class QuestionDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public Guid CreatedByUserId { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int Views { get; set; }
        public bool IsClosed { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
    }
}

