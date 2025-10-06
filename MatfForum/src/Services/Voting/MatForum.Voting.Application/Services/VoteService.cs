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
            // Check if user already voted on this question
            var existingVote = await _voteRepository.GetByQuestionAndUserAsync(command.QuestionId, command.UserId);
            
            if (existingVote != null)
            {
                // User already voted, update the existing vote
                existingVote.ChangeVoteType(command.VoteType);
                await _voteRepository.UpdateAsync(existingVote);
                
                return MapToDto(existingVote);
            }
            else
            {
                // New vote
                var vote = new Vote(command.QuestionId, command.UserId, command.VoteType);
                await _voteRepository.AddAsync(vote);
                
                return MapToDto(vote);
            }
        }

        public async Task<VoteDto> ChangeVoteAsync(ChangeVoteCommand command)
        {
            var existingVote = await _voteRepository.GetByQuestionAndUserAsync(command.QuestionId, command.UserId);
            
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
            var existingVote = await _voteRepository.GetByQuestionAndUserAsync(command.QuestionId, command.UserId);
            
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
            var votes = await _voteRepository.GetByQuestionIdAsync(questionId);
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
                UserId = vote.UserId,
                VoteType = vote.VoteType,
                CreatedDate = vote.CreatedAt,
                LastModifiedDate = vote.UpdatedAt
            };
        }
    }
}

