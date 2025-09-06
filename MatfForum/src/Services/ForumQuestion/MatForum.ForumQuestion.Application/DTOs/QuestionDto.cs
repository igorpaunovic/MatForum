using System;
using System.Collections.Generic;

namespace MatForum.ForumQuestion.Application.DTOs
{
    public class QuestionDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public Guid CreatedByUserId { get; set; }
        public string AuthorName { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset LastModifiedDate { get; set; }
        public int Views { get; set; }
        public bool IsClosed { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
    }

    public class CreateQuestionCommand
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public Guid CreatedByUserId { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
    }

    public class UpdateQuestionCommand
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
    }
}