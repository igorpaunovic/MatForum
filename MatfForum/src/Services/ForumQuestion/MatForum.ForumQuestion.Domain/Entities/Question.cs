using MatForum.Shared.Domain.Common;

namespace MatForum.ForumQuestion.Domain.Entities;

public class Question : BaseEntity
{
    public string Title { get; private set; }
    public string Content { get; private set; }
    public Guid CreatedByUserId { get; private set; } // Logical ID for user
    public DateTimeOffset CreatedDate { get; private set; }
    public DateTimeOffset LastModifiedDate { get; private set; }
    public int Views { get; private set; }
    public bool IsClosed { get; private set; }
    public List<string> Tags { get; private set; } = new List<string>();

    // Constructor for creating new questions
    public Question(string title, string content, Guid createdByUserId, List<string>? tags = null)
    {
        if (string.IsNullOrWhiteSpace(title)) throw new ArgumentException("Title cannot be empty.", nameof(title));
        if (string.IsNullOrWhiteSpace(content)) throw new ArgumentException("Content cannot be empty.", nameof(content));
        if (createdByUserId == Guid.Empty) throw new ArgumentException("CreatedByUserId cannot be empty.", nameof(createdByUserId));

        Id = Guid.NewGuid();
        Title = title;
        Content = content;
        CreatedByUserId = createdByUserId;
        CreatedDate = DateTimeOffset.UtcNow;
        LastModifiedDate = CreatedDate;
        Views = 0;
        IsClosed = false;
        Tags = tags ?? new List<string>();
    }

    // Methods for domain behavior
    public void Update(string title, string content, List<string>? tags = null)
    {
        if (string.IsNullOrWhiteSpace(title)) throw new ArgumentException("Title cannot be empty.", nameof(title));
        if (string.IsNullOrWhiteSpace(content)) throw new ArgumentException("Content cannot be empty.", nameof(content));

        Title = title;
        Content = content;
        LastModifiedDate = DateTimeOffset.UtcNow;
        Tags = tags ?? new List<string>();
    }

    public void IncrementViews()
    {
        Views++;
    }

    public void Close()
    {
        IsClosed = true;
    }

    public void AddTag(string tag)
    {
        if (!string.IsNullOrWhiteSpace(tag) && !Tags.Contains(tag.ToLowerInvariant()))
        {
            Tags.Add(tag.ToLowerInvariant());
        }
    }

    public void RemoveTag(string tag)
    {
        if (!string.IsNullOrWhiteSpace(tag))
        {
            Tags.Remove(tag.ToLowerInvariant());
        }
    }
}
