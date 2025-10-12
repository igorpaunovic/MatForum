using MatForum.ForumQuestion.Application.DTOs;
using MatForum.ForumQuestion.Application.Interfaces; 
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MatForum.ForumQuestion.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly IForumQuestionService _questionService;

        public QuestionsController(IForumQuestionService questionService)
        {
            _questionService = questionService;
        }

        [HttpPost]
        public async Task<ActionResult<QuestionDto>> CreateQuestion([FromBody] CreateQuestionCommand command)
        {
            // Basic validation for demonstration. More complex validation might use FluentValidation.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (command.CreatedByUserId == Guid.Empty)
            {
                // In a real app, this would come from authentication context, not the request body
                return BadRequest("CreatedByUserId must be a valid GUID.");
            }

            try
            {
                var createdQuestion = await _questionService.CreateQuestion(command);
                return CreatedAtAction(nameof(GetQuestionById), new { id = createdQuestion.Id }, createdQuestion);
            }
            catch (ArgumentException ex) // Catching domain-level validation errors
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<QuestionDto>> GetQuestionById(Guid id)
        {
            var question = await _questionService.GetQuestionById(id);
            if (question == null)
            {
                return NotFound();
            }
            return Ok(question);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuestionDto>>> GetAllQuestions()
        {
            var questions = await _questionService.GetAllQuestions();
            return Ok(questions);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<QuestionDto>>> SearchQuestions([FromQuery] string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                var allQuestions = await _questionService.GetAllQuestions();
                return Ok(allQuestions);
            }

            var questions = await _questionService.SearchQuestions(searchTerm);
            return Ok(questions);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(Guid id, [FromBody] UpdateQuestionCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("ID mismatch.");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updated = await _questionService.UpdateQuestion(command);
                if (!updated)
                {
                    return NotFound();
                }
                return NoContent(); // 204 No Content for successful update
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(Guid id)
        {
            var deleted = await _questionService.DeleteQuestion(id);
            if (!deleted)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpGet("{id}/exists")]
        public async Task<IActionResult> Exists(Guid id)
        {
            var exists = await _questionService.GetQuestionById(id) != null;
            return exists ? Ok() : NotFound();
        }

        [HttpGet("{id}/similar")]
        public async Task<ActionResult<IEnumerable<QuestionDto>>> GetSimilarQuestions(Guid id, [FromQuery] int count = 3)
        {
            var similarQuestions = await _questionService.GetSimilarQuestions(id, count);
            return Ok(similarQuestions);
        }

        [HttpGet("count")]
        public async Task<ActionResult<int>> GetCount()
        {
            var count = await _questionService.GetCount();
            return Ok(count);
        }

        [HttpGet("by-user/{userId}")]
        public async Task<ActionResult<IEnumerable<QuestionDto>>> GetQuestionsByUserId(Guid userId)
        {
            var questions = await _questionService.GetQuestionsByUserId(userId);
            return Ok(questions);
        }

        [HttpGet("count-by-user/{userId}")]
        public async Task<ActionResult<int>> GetCountByUserId(Guid userId)
        {
            var questions = await _questionService.GetQuestionsByUserId(userId);
            return Ok(questions.Count());
        }
    }
}
