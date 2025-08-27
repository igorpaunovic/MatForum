using MatForum.ForumQuestion.Application.DTOs;
using MatForum.ForumQuestion.Application.Interfaces;
using MatForum.ForumQuestion.Domain.Entities;
using MatForum.UserManagement.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MatForum.ForumQuestion.Application.Services
{
    public class ForumQuestionService : IForumQuestionService
    {
        private readonly IQuestionRepository _questionRepository;
        private readonly IUserService _userService; // <-- ADDED dependency on IUserService

        public ForumQuestionService(IQuestionRepository questionRepository, IUserService userService)
        {
            _questionRepository = questionRepository;
            _userService = userService;
        }

        public async Task<QuestionDto> CreateQuestionAsync(CreateQuestionCommand command)
        {
            // Fetch the user information from the user service
            var user = await _userService.GetById(command.CreatedByUserId);
            //
            // var users = await _userService.GetAll();
            //
            // Console.WriteLine($"All users: ");
            // foreach (var u in users)
            // {
            //     Console.WriteLine(u.Username);
            // }
            //
            // // Console logging for debugging purposes.
            // Console.WriteLine($"Attempting to create question for user ID: {command.CreatedByUserId}");
            // if (user != null)
            // {
            //     Console.WriteLine($"Found user: {user.Username}");
            // }
            // else
            // {
            //     Console.WriteLine("User not found.");
            // }
            //
            // if (user == null)
            // {
            //     throw new InvalidOperationException("Cannot create question for a non-existent user.");
            // }
            //
            // Domain validation is handled by Question constructor
            var question = new Question(command.Title, command.Content, command.CreatedByUserId, command.Tags);
            await _questionRepository.Create(question);

            return new QuestionDto
            {
                Id = question.Id,
                Title = question.Title,
                Content = question.Content,
                CreatedByUserId = question.CreatedByUserId,
                AuthorName = user?.Username ?? "Unknown User", // Populate AuthorName with the retrieved username or a placeholder
                CreatedDate = question.CreatedDate,
                LastModifiedDate = question.LastModifiedDate,
                Views = question.Views,
                IsClosed = question.IsClosed,
                Tags = question.Tags
            };
        }

        public async Task<QuestionDto> GetQuestionByIdAsync(Guid id)
        {
            var question = await _questionRepository.GetById(id);
            if (question == null) return null;

            question.IncrementViews(); // Business rule: view increments on fetch
            await _questionRepository.Update(id, question); // Persist updated view count
            
            // Fetch the user information from the user service
            var user = await _userService.GetById(question.CreatedByUserId);

            return new QuestionDto
            {
                Id = question.Id,
                Title = question.Title,
                Content = question.Content,
                CreatedByUserId = question.CreatedByUserId,
                AuthorName = user?.Username ?? "Unknown User", // Populate AuthorName with the retrieved username or a placeholder
                CreatedDate = question.CreatedDate,
                LastModifiedDate = question.LastModifiedDate,
                Views = question.Views,
                IsClosed = question.IsClosed,
                Tags = question.Tags
            };
        }

        public async Task<IEnumerable<QuestionDto>> GetAllQuestionsAsync()
        {
            var questions = await _questionRepository.GetAll();
            var questionDtos = new List<QuestionDto>();
            
            foreach (var q in questions)
            {
                // Fetch the user for each question
                var user = await _userService.GetById(q.CreatedByUserId);
                
                questionDtos.Add(new QuestionDto
                {
                    Id = q.Id,
                    Title = q.Title,
                    Content = q.Content,
                    CreatedByUserId = q.CreatedByUserId,
                    AuthorName = user?.Username ?? "Unknown User", // Populate with the retrieved username
                    CreatedDate = q.CreatedDate,
                    LastModifiedDate = q.LastModifiedDate,
                    Views = q.Views,
                    IsClosed = q.IsClosed,
                    Tags = q.Tags
                });
            }
            
            return questionDtos;
        }

        public async Task<bool> UpdateQuestionAsync(UpdateQuestionCommand command)
        {
            var question = await _questionRepository.GetById(command.Id);
            var id = command.Id;
            if (question == null) return false;

            question.Update(command.Title, command.Content, command.Tags);
            await _questionRepository.Update(id, question);
            return true;
        }

        public async Task<bool> DeleteQuestionAsync(Guid id)
        {
            var question = await _questionRepository.GetById(id);
            if (question == null) return false;

            await _questionRepository.Delete(id);
            return true;
        }
    }
}
