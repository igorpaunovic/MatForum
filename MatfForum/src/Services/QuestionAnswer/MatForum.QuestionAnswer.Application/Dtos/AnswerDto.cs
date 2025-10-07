namespace MatForum.QuestionAnswer.Application.Dtos;

public class AnswerDto
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public Guid QuestionId { get; set; }
    public Guid AuthorId { get; set; }
}

