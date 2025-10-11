using MatForum.Shared.Domain.Common;

namespace MatForum.QuestionAnswer.Domain.Entities;

public class Answer : BaseEntity
{
    public Guid Id { get; private set; }
    public string Content { get; set; }

    // --- CONNECTIONS TO OTHER SERVICES ---
    public Guid QuestionId { get; private set; } // Link to ForumQuestion
    public Guid AuthorId { get; private set; }   // Link to UserManagement
    public Guid? ParentAnswerId { get; private set; } // Link to parent Answer (null = direct answer to question)

    // Private constructor for EF Core
    private Answer() {}

    public static Answer Create(string content, Guid questionId, Guid authorId, Guid? parentAnswerId = null)
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
            ParentAnswerId = parentAnswerId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void Update(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
        {
            throw new ArgumentException("Answer content cannot be empty.", nameof(content));
        }
        
        Content = content;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Delete()
    {
        IsDeleted = true;
        DeletedAt = DateTime.UtcNow;
    }
}