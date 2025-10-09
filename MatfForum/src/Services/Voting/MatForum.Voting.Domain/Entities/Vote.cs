using MatForum.Shared.Domain.Common;

namespace MatForum.Voting.Domain.Entities;

public class Vote : BaseEntity
{
    public Guid? QuestionId { get; private set; } // Vote on question (null if voting on answer)
    public Guid? AnswerId { get; private set; }   // Vote on answer (null if voting on question)
    public Guid UserId { get; private set; }
    public VoteType VoteType { get; private set; }

    // Private constructor for EF Core
    private Vote() {}

    // Factory method for voting on a question
    public static Vote CreateForQuestion(Guid questionId, Guid userId, VoteType voteType)
    {
        if (questionId == Guid.Empty) throw new ArgumentException("QuestionId cannot be empty.", nameof(questionId));
        if (userId == Guid.Empty) throw new ArgumentException("UserId cannot be empty.", nameof(userId));

        return new Vote
        {
            Id = Guid.NewGuid(),
            QuestionId = questionId,
            AnswerId = null,
            UserId = userId,
            VoteType = voteType,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    // Factory method for voting on an answer
    public static Vote CreateForAnswer(Guid answerId, Guid userId, VoteType voteType)
    {
        if (answerId == Guid.Empty) throw new ArgumentException("AnswerId cannot be empty.", nameof(answerId));
        if (userId == Guid.Empty) throw new ArgumentException("UserId cannot be empty.", nameof(userId));

        return new Vote
        {
            Id = Guid.NewGuid(),
            QuestionId = null,
            AnswerId = answerId,
            UserId = userId,
            VoteType = voteType,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
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
        // Ne menjamo UpdatedAt da izbegnemo DateTime probleme sa Postgres
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

