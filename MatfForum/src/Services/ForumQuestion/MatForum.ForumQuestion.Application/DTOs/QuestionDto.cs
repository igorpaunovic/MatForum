using System;
using System.Collections.Generic;

namespace MatForum.ForumQuestion.Application.DTOs
{
    public class QuestionDto
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Content { get; set; }
        public Guid CreatedByUserId { get; set; }
        public required string AuthorName { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public int Views { get; set; }
        public bool IsClosed { get; set; }
        public bool IsEdited { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
    }

    public class CreateQuestionCommand
    {
        public required string Title { get; set; }
        public required string Content { get; set; }
        public Guid CreatedByUserId { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
    }

    public class UpdateQuestionCommand
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new List<string>();
        public Guid UpdatedByUserId { get; set; }
    }
}