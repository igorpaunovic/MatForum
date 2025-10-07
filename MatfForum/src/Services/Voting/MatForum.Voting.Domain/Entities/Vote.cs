using MatForum.Shared.Domain.Common;

namespace MatForum.Voting.Domain.Entities;

public class Vote : BaseEntity
{
    public Guid QuestionId { get; private set; }
    public Guid UserId { get; private set; }
    public VoteType VoteType { get; private set; }
    // public DateTimeOffset CreatedAt { get; private set; }
    // public DateTimeOffset UpdatedAt { get; private set; }

    // Constructor for creating new votes
    public Vote(Guid questionId, Guid userId, VoteType voteType)
    {
        if (questionId == Guid.Empty) throw new ArgumentException("QuestionId cannot be empty.", nameof(questionId));
        if (userId == Guid.Empty) throw new ArgumentException("UserId cannot be empty.", nameof(userId));

        Id = Guid.NewGuid();
        QuestionId = questionId;
        UserId = userId;
        VoteType = voteType;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
    }

    // Method to change vote type (upvote to downvote or vice versa)
    public void ChangeVoteType(VoteType newVoteType)
    {
        VoteType = newVoteType;
        UpdatedAt = DateTime.UtcNow;
    }

    // Method to remove vote (set to neutral)
    public void RemoveVote()
    {
        VoteType = VoteType.Neutral;
        UpdatedAt = DateTime.UtcNow;
    }

    // Method to check if vote is active (not neutral)
    public bool IsActive => VoteType != VoteType.Neutral;
}

public enum VoteType
{
    Downvote = -1,
    Neutral = 0,
    Upvote = 1
}

