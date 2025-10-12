using MatForum.QuestionAnswer.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MatForum.QuestionAnswer.Api.Controllers;

[ApiController]
[Route("api/answers")]
public class AnswersController : ControllerBase
{
    private readonly IAnswerService _answerService;
    private readonly IQuestionValidator _questionValidator;
    private readonly IUserService _userService;

    public AnswersController(
        IAnswerService answerService,
        IQuestionValidator questionValidator,
        IUserService userService)
    {
        _answerService = answerService;
        _questionValidator = questionValidator;
        _userService = userService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAnswer([FromBody] CreateAnswerRequest request, CancellationToken cancellationToken)
    {
        var questionExists = await _questionValidator.ExistsAsync(request.QuestionId, cancellationToken);
        if (!questionExists)
            return NotFound(new { Message = "Question not found." });

        var userExists = await _userService.ExistsAsync(request.UserId, cancellationToken);
        if (!userExists)
            return NotFound(new { Message = "User not found." });

        var answerId = await _answerService.CreateAnswerAsync(
            request.Content,
            request.QuestionId,
            request.UserId,
            request.ParentAnswerId,
            cancellationToken
        );

        return CreatedAtAction(nameof(GetAnswerById), new { answerId }, new { answerId });
    }

    [HttpGet("{answerId}")]
    public async Task<IActionResult> GetAnswerById(Guid answerId, CancellationToken cancellationToken)
    {
        var answer = await _answerService.GetAnswerByIdAsync(answerId, cancellationToken);
        if (answer == null)
            return NotFound(new { Message = "Answer not found." });
        return Ok(answer);
    }
    
    [HttpGet("by-question/{questionId}")]
    public async Task<IActionResult> GetAnswersByQuestionId(Guid questionId, CancellationToken cancellationToken)
    {
        var answers = await _answerService.GetAnswersByQuestionIdAsync(questionId, cancellationToken);
        return Ok(answers);
    }

    [HttpPut("{answerId}")]
    public async Task<IActionResult> UpdateAnswer(Guid answerId, [FromBody] UpdateAnswerRequest request, CancellationToken cancellationToken)
    {
        var answer = await _answerService.GetAnswerByIdAsync(answerId, cancellationToken);
        if (answer == null)
            return NotFound(new { Message = "Answer not found." });

        // You may want to validate question/user existence here as well
        var updatedAnswerId = await _answerService.UpdateAnswerAsync(answerId, request.Content, cancellationToken);
        if (updatedAnswerId == null)
            return BadRequest(new { Message = "Update failed." });
        return Ok(new { answerId = updatedAnswerId });
    }

    [HttpDelete("{answerId}")]
    public async Task<IActionResult> DeleteAnswer(Guid answerId, CancellationToken cancellationToken)
    {
        var answer = await _answerService.GetAnswerByIdAsync(answerId, cancellationToken);
        if (answer == null)
            return NotFound(new { Message = "Answer not found." });

        var deleted = await _answerService.DeleteAnswerAsync(answerId, cancellationToken);
        if (!deleted)
            return BadRequest(new { Message = "Delete failed." });
        return NoContent();
    }

    [HttpGet("count")]
    public async Task<IActionResult> GetCount(CancellationToken cancellationToken)
    {
        var count = await _answerService.GetCountAsync(cancellationToken);
        return Ok(count);
    }
}

public class CreateAnswerRequest
{
    public required string Content { get; set; }
    public required Guid QuestionId { get; set; }
    public required Guid UserId { get; set; }
    public Guid? ParentAnswerId { get; set; } // Optional - for replying to another answer
}

public class UpdateAnswerRequest
{
    public required string Content { get; set; }
}
