using MatForum.Voting.Application.DTOs;
using MatForum.Voting.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MatForum.Voting.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VotesController : ControllerBase
    {
        private readonly IVoteService _voteService;

        public VotesController(IVoteService voteService)
        {
            _voteService = voteService;
        }

        [HttpPost("vote")]
        // No [Authorize] needed - API Gateway handles authentication
        public async Task<ActionResult<VoteDto>> VoteQuestion([FromBody] VoteQuestionCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (command.QuestionId == Guid.Empty)
            {
                return BadRequest("QuestionId must be a valid GUID.");
            }

            if (command.UserId == Guid.Empty)
            {
                return BadRequest("UserId must be a valid GUID.");
            }

            try
            {
                var vote = await _voteService.VoteQuestionAsync(command);
                return Ok(vote);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("change")]
        // No [Authorize] needed - API Gateway handles authentication
        public async Task<ActionResult<VoteDto>> ChangeVote([FromBody] ChangeVoteCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (command.QuestionId == Guid.Empty)
            {
                return BadRequest("QuestionId must be a valid GUID.");
            }

            if (command.UserId == Guid.Empty)
            {
                return BadRequest("UserId must be a valid GUID.");
            }

            try
            {
                var vote = await _voteService.ChangeVoteAsync(command);
                return Ok(vote);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("remove")]
        // No [Authorize] needed - API Gateway handles authentication
        public async Task<IActionResult> RemoveVote([FromBody] RemoveVoteCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (command.QuestionId == Guid.Empty)
            {
                return BadRequest("QuestionId must be a valid GUID.");
            }

            if (command.UserId == Guid.Empty)
            {
                return BadRequest("UserId must be a valid GUID.");
            }

            var removed = await _voteService.RemoveVoteAsync(command);
            if (!removed)
            {
                return NotFound("No vote found to remove.");
            }

            return NoContent();
        }

        [HttpGet("user/{questionId}/{userId}")]
        // No [Authorize] needed - API Gateway handles authentication
        public async Task<ActionResult<VoteDto>> GetUserVote(Guid questionId, Guid userId)
        {
            if (questionId == Guid.Empty)
            {
                return BadRequest("QuestionId must be a valid GUID.");
            }

            if (userId == Guid.Empty)
            {
                return BadRequest("UserId must be a valid GUID.");
            }

            var vote = await _voteService.GetUserVoteAsync(questionId, userId);
            if (vote == null)
            {
                return NotFound();
            }

            return Ok(vote);
        }

        [HttpGet("summary/{questionId}")]
        public async Task<ActionResult<QuestionVoteSummaryDto>> GetQuestionVoteSummary(Guid questionId, [FromQuery] Guid? userId = null)
        {
            if (questionId == Guid.Empty)
            {
                return BadRequest("QuestionId must be a valid GUID.");
            }

            var summary = await _voteService.GetQuestionVoteSummaryAsync(questionId, userId);
            return Ok(summary);
        }

        [HttpGet("question/{questionId}")]
        public async Task<ActionResult<IEnumerable<VoteDto>>> GetQuestionVotes(Guid questionId)
        {
            if (questionId == Guid.Empty)
            {
                return BadRequest("QuestionId must be a valid GUID.");
            }

            var votes = await _voteService.GetQuestionVotesAsync(questionId);
            return Ok(votes);
        }

        [HttpGet("summary/answer/{answerId}")]
        public async Task<ActionResult<QuestionVoteSummaryDto>> GetAnswerVoteSummary(Guid answerId, [FromQuery] Guid? userId = null)
        {
            if (answerId == Guid.Empty)
            {
                return BadRequest("AnswerId must be a valid GUID.");
            }

            var summary = await _voteService.GetAnswerVoteSummaryAsync(answerId, userId);
            return Ok(summary);
        }
    }
}

