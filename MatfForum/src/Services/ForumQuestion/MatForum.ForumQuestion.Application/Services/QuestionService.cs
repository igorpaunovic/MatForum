using MatForum.ForumQuestion.Application.DTOs;
using MatForum.ForumQuestion.Application.Interfaces;
using MatForum.ForumQuestion.Domain.Entities;
using MatForum.UserManagement.Application.Interfaces;
using MatForum.UserManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
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
            // Fetch the user information from the user service using the correct method.
            var user = await _userService.GetById(command.CreatedByUserId);

            if (user == null)
            {
                throw new InvalidOperationException("Cannot create question for a non-existent user.");
            }
            
            // Domain validation is handled by Question constructor
            var question = new Question(command.Title, command.Content, command.CreatedByUserId, command.Tags);
            await _questionRepository.Create(question);

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

        public async Task<QuestionDto?> GetQuestionById(Guid id)
        {
            var question = await _questionRepository.GetById(id);
            if (question == null) return null;

            question.IncrementViews(); // Business rule: view increments on fetch
            await _questionRepository.Update(id, question); // Persist updated view count
            
            // Fetch the user information from the user service using the correct method.
            var user = await _userService.GetById(question.CreatedByUserId);

            return new QuestionDto
            {
                Id = question.Id,
                Title = question.Title,
                Content = question.Content,
                CreatedByUserId = question.CreatedByUserId,
                AuthorName = user?.Username ?? "Unknown User", // Use the User domain entity to get the username
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
            var questionDtos = new List<QuestionDto>();
            
            var users = (await _userService.GetAll()).ToDictionary(u => u.Id);
            
            foreach (var q in questions)
            {
                // Look up the user in the dictionary.
                users.TryGetValue(q.CreatedByUserId, out var user);
                
                questionDtos.Add(new QuestionDto
                {
                    Id = q.Id,
                    Title = q.Title,
                    Content = q.Content,
                    CreatedByUserId = q.CreatedByUserId,
                    AuthorName = user?.Username ?? "Unknown User", // Use the User domain entity to get the username
                    CreatedAt = q.CreatedAt,
                    UpdatedAt = q.UpdatedAt,
                    Views = q.Views,
                    IsClosed = q.IsClosed,
                    Tags = q.Tags
                });
            }
            
            return questionDtos;
        }

        public async Task<bool> UpdateQuestion(UpdateQuestionCommand command)
        {
            var question = await _questionRepository.GetById(command.Id);
            var id = command.Id;
            if (question == null) return false;

            question.Update(command.Title, command.Content, command.Tags);
            await _questionRepository.Update(id, question);
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
