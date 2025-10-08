using MatForum.Shared.Domain.Common;

namespace MatForum.QuestionAnswer.Domain.Entities;

public class Answer : BaseEntity
{
    public Guid Id { get; private set; }
    public string Content { get; set; }

    // --- CONNECTIONS TO OTHER SERVICES ---
    public Guid QuestionId { get; private set; } // Link to ForumQuestion
    public Guid AuthorId { get; private set; }   // Link to UserManagement

    // Private constructor for EF Core
    private Answer() {}

    public static Answer Create(string content, Guid questionId, Guid authorId)
    {
        // Add validation logic here. e.g., content cannot be empty.
        if (string.IsNullOrWhiteSpace(content))
        {
            throw new ArgumentException("Answer content cannot be empty.", nameof(content));
        }

        return new Answer
        {
            Id = Guid.NewGuid(),
            Content = content,
            QuestionId = questionId,
            AuthorId = authorId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}