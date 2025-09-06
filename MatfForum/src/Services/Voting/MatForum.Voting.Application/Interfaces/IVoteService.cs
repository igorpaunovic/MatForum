using MatForum.Voting.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MatForum.Voting.Application.Interfaces
{
    public interface IVoteService
    {
        Task<VoteDto> VoteQuestionAsync(VoteQuestionCommand command);
        Task<VoteDto> ChangeVoteAsync(ChangeVoteCommand command);
        Task<bool> RemoveVoteAsync(RemoveVoteCommand command);
        Task<VoteDto> GetUserVoteAsync(Guid questionId, Guid userId);
        Task<QuestionVoteSummaryDto> GetQuestionVoteSummaryAsync(Guid questionId, Guid? userId = null);
        Task<IEnumerable<VoteDto>> GetQuestionVotesAsync(Guid questionId);
    }
}

