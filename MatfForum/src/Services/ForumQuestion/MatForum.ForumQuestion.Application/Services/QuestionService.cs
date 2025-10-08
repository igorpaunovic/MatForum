using MatForum.ForumQuestion.Application.DTOs;
using MatForum.ForumQuestion.Application.Interfaces;
using MatForum.ForumQuestion.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace MatForum.ForumQuestion.Application.Services
{
    public class ForumQuestionService : IForumQuestionService
    {
        private readonly IQuestionRepository _questionRepository;
        private readonly IUserService _userService;

        public ForumQuestionService(IQuestionRepository questionRepository, IUserService userService)
        {
            _questionRepository = questionRepository;
            _userService = userService;
        }

        public async Task<QuestionDto> CreateQuestion(CreateQuestionCommand command)
        {
            var user = await _userService.GetByIdAsync(command.CreatedByUserId);
            if (user == null)
            {
                throw new InvalidOperationException("Cannot create question for a non-existent user.");
            }
            var question = new Question(command.Title, command.Content, command.CreatedByUserId, command.Tags);
            await _questionRepository.Create(question);
            return new QuestionDto
            {
                Id = question.Id,
                Title = question.Title,
                Content = question.Content,
                CreatedByUserId = question.CreatedByUserId,
                AuthorName = user.Username ?? "Unknown User",
                CreatedAt = question.CreatedAt,
                UpdatedAt = question.UpdatedAt,
                Views = question.Views,
                IsClosed = question.IsClosed,
                Tags = question.Tags
            };
        }

        public async Task<QuestionDto?> GetQuestionById(Guid id)
        {
            var question = await _questionRepository.GetById(id);
            if (question == null) return null;
            question.IncrementViews();
            await _questionRepository.Update(id, question);
            var user = await _userService.GetByIdAsync(question.CreatedByUserId);
            return new QuestionDto
            {
                Id = question.Id,
                Title = question.Title,
                Content = question.Content,
                CreatedByUserId = question.CreatedByUserId,
                AuthorName = user?.Username ?? "Unknown User",
                CreatedAt = question.CreatedAt,
                UpdatedAt = question.UpdatedAt,
                Views = question.Views,
                IsClosed = question.IsClosed,
                Tags = question.Tags
            };
        }
        public async Task<IEnumerable<QuestionDto>> GetAllQuestions()
        {
            var questions = await _questionRepository.GetAll();
            var dtos = new List<QuestionDto>();
            foreach (var question in questions)
            {
                var user = await _userService.GetByIdAsync(question.CreatedByUserId);
                dtos.Add(new QuestionDto
                {
                    Id = question.Id,
                    Title = question.Title,
                    Content = question.Content,
                    CreatedByUserId = question.CreatedByUserId,
                    AuthorName = user?.Username ?? "Unknown User",
                    CreatedAt = question.CreatedAt,
                    UpdatedAt = question.UpdatedAt,
                    Views = question.Views,
                    IsClosed = question.IsClosed,
                    Tags = question.Tags
                });
            }
            return dtos;
        }

        public async Task<bool> UpdateQuestion(UpdateQuestionCommand command)
        {
            var question = await _questionRepository.GetById(command.Id);
            if (question == null) return false;
            var user = await _userService.GetByIdAsync(command.UpdatedByUserId);
            if (user == null) return false;
            question.Update(command.Title, command.Content, command.Tags);
            await _questionRepository.Update(command.Id, question);
            return true;
        }

        public async Task<bool> DeleteQuestion(Guid id)
        {
            var question = await _questionRepository.GetById(id);
            if (question == null) return false;
            await _questionRepository.Delete(id);
            return true;
        }
    }
}
