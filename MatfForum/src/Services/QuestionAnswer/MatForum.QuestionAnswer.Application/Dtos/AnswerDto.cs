namespace MatForum.QuestionAnswer.Application.Dtos;

public class AnswerDto
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid QuestionId { get; set; }
    public Guid AuthorId { get; set; }
    public Guid? ParentAnswerId { get; set; }
    public string? AuthorName { get; set; }
    public List<AnswerDto>? Replies { get; set; } // Nested replies for threaded view
}
