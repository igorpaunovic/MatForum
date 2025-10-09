using MatForum.Voting.Application.DTOs;
using MatForum.Voting.Application.Interfaces;
using MatForum.Voting.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MatForum.Voting.Application.Services
{
    public class VoteService : IVoteService
    {
        private readonly IVoteRepository _voteRepository;

        public VoteService(IVoteRepository voteRepository)
        {
            _voteRepository = voteRepository;
        }

        public async Task<VoteDto> VoteQuestionAsync(VoteQuestionCommand command)
        {
            // Validate: must have either QuestionId or AnswerId, not both
            if (command.QuestionId.HasValue && command.AnswerId.HasValue)
                throw new ArgumentException("Cannot vote on both question and answer simultaneously.");
            if (!command.QuestionId.HasValue && !command.AnswerId.HasValue)
                throw new ArgumentException("Must specify either QuestionId or AnswerId.");

            Vote existingVote;
            Vote newVote;

            if (command.QuestionId.HasValue)
            {
                // Voting on a question
                existingVote = await _voteRepository.GetByQuestionAndUserAsync(command.QuestionId.Value, command.UserId);
                if (existingVote != null)
                {
                    existingVote.ChangeVoteType(command.VoteType);
                    await _voteRepository.UpdateAsync(existingVote);
                    return MapToDto(existingVote);
                }
                newVote = Vote.CreateForQuestion(command.QuestionId.Value, command.UserId, command.VoteType);
            }
            else
            {
                // Voting on an answer
                existingVote = await _voteRepository.GetByAnswerAndUserAsync(command.AnswerId!.Value, command.UserId);
                if (existingVote != null)
                {
                    existingVote.ChangeVoteType(command.VoteType);
                    await _voteRepository.UpdateAsync(existingVote);
                    return MapToDto(existingVote);
                }
                newVote = Vote.CreateForAnswer(command.AnswerId!.Value, command.UserId, command.VoteType);
            }

            await _voteRepository.AddAsync(newVote);
            return MapToDto(newVote);
        }

        public async Task<VoteDto> ChangeVoteAsync(ChangeVoteCommand command)
        {
            Vote existingVote;
            
            if (command.QuestionId.HasValue)
            {
                existingVote = await _voteRepository.GetByQuestionAndUserAsync(command.QuestionId.Value, command.UserId);
            }
            else if (command.AnswerId.HasValue)
            {
                existingVote = await _voteRepository.GetByAnswerAndUserAsync(command.AnswerId.Value, command.UserId);
            }
            else
            {
                throw new ArgumentException("Must specify either QuestionId or AnswerId.");
            }
            
            if (existingVote == null)
            {
                throw new InvalidOperationException("No vote found to change.");
            }

            existingVote.ChangeVoteType(command.NewVoteType);
            await _voteRepository.UpdateAsync(existingVote);
            
            return MapToDto(existingVote);
        }

        public async Task<bool> RemoveVoteAsync(RemoveVoteCommand command)
        {
            Vote existingVote;
            
            if (command.QuestionId.HasValue)
            {
                existingVote = await _voteRepository.GetByQuestionAndUserAsync(command.QuestionId.Value, command.UserId);
            }
            else if (command.AnswerId.HasValue)
            {
                existingVote = await _voteRepository.GetByAnswerAndUserAsync(command.AnswerId.Value, command.UserId);
            }
            else
            {
                throw new ArgumentException("Must specify either QuestionId or AnswerId.");
            }
            
            if (existingVote == null)
            {
                return false; // No vote to remove
            }

            existingVote.RemoveVote();
            await _voteRepository.UpdateAsync(existingVote);
            
            return true;
        }

        public async Task<VoteDto> GetUserVoteAsync(Guid questionId, Guid userId)
        {
            var vote = await _voteRepository.GetByQuestionAndUserAsync(questionId, userId);
            return vote != null ? MapToDto(vote) : null;
        }

        public async Task<QuestionVoteSummaryDto> GetQuestionVoteSummaryAsync(Guid questionId, Guid? userId = null)
        {
            return await GetVoteSummaryAsync(questionId, null, userId);
        }

        public async Task<QuestionVoteSummaryDto> GetAnswerVoteSummaryAsync(Guid answerId, Guid? userId = null)
        {
            return await GetVoteSummaryAsync(null, answerId, userId);
        }

        private async Task<QuestionVoteSummaryDto> GetVoteSummaryAsync(Guid? questionId, Guid? answerId, Guid? userId)
        {
            IEnumerable<Vote> votes;
            
            if (questionId.HasValue)
            {
                votes = await _voteRepository.GetByQuestionIdAsync(questionId.Value);
            }
            else if (answerId.HasValue)
            {
                votes = await _voteRepository.GetByAnswerIdAsync(answerId.Value);
            }
            else
            {
                throw new ArgumentException("Must specify either QuestionId or AnswerId.");
            }

            var activeVotes = votes.Where(v => v.IsActive).ToList();

            var upvotes = activeVotes.Count(v => v.VoteType == VoteType.Upvote);
            var downvotes = activeVotes.Count(v => v.VoteType == VoteType.Downvote);
            var totalVotes = upvotes + downvotes;

            VoteType? userVote = null;
            if (userId.HasValue)
            {
                var userVoteEntity = activeVotes.FirstOrDefault(v => v.UserId == userId.Value);
                userVote = userVoteEntity?.VoteType;
            }

            return new QuestionVoteSummaryDto
            {
                QuestionId = questionId,
                AnswerId = answerId,
                Upvotes = upvotes,
                Downvotes = downvotes,
                TotalVotes = totalVotes,
                UserVote = userVote
            };
        }

        public async Task<IEnumerable<VoteDto>> GetQuestionVotesAsync(Guid questionId)
        {
            var votes = await _voteRepository.GetByQuestionIdAsync(questionId);
            return votes.Select(MapToDto).ToList();
        }

        private static VoteDto MapToDto(Vote vote)
        {
            return new VoteDto
            {
                Id = vote.Id,
                QuestionId = vote.QuestionId,
                AnswerId = vote.AnswerId,
                UserId = vote.UserId,
                VoteType = vote.VoteType,
                CreatedDate = vote.CreatedAt,
                LastModifiedDate = vote.UpdatedAt
            };
        }
    }
}

