using MatForum.Voting.Domain.Entities;

namespace MatForum.Voting.Application.DTOs
{
    public class VoteDto
    {
        public Guid Id { get; set; }
        public Guid QuestionId { get; set; }
        public Guid UserId { get; set; }
        public VoteType VoteType { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset LastModifiedDate { get; set; }
    }

    public class VoteQuestionCommand
    {
        public Guid QuestionId { get; set; }
        public Guid UserId { get; set; }
        public VoteType VoteType { get; set; }
    }

    public class ChangeVoteCommand
    {
        public Guid QuestionId { get; set; }
        public Guid UserId { get; set; }
        public VoteType NewVoteType { get; set; }
    }

    public class RemoveVoteCommand
    {
        public Guid QuestionId { get; set; }
        public Guid UserId { get; set; }
    }

    public class QuestionVoteSummaryDto
    {
        public Guid QuestionId { get; set; }
        public int Upvotes { get; set; }
        public int Downvotes { get; set; }
        public int TotalVotes { get; set; }
        public VoteType? UserVote { get; set; } // null if user hasn't voted
    }
}

