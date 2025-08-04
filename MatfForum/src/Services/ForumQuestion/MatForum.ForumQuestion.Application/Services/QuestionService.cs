using MatForum.ForumQuestion.Application.DTOs;
using MatForum.ForumQuestion.Application.Interfaces;
using MatForum.ForumQuestion.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MatForum.ForumQuestion.Application.Services
{
    public class QuestionService
    {
        private readonly IQuestionRepository _questionRepository;

        public QuestionService(IQuestionRepository questionRepository)
        {
            _questionRepository = questionRepository;
        }

        public async Task<QuestionDto> CreateQuestionAsync(CreateQuestionCommand command)
        {
            // Domain validation is handled by Question constructor
            var question = new Question(command.Title, command.Content, command.CreatedByUserId, command.Tags);
            await _questionRepository.AddAsync(question);

            return new QuestionDto
            {
                Id = question.Id,
                Title = question.Title,
                Content = question.Content,
                CreatedByUserId = question.CreatedByUserId,
                AuthorName = "Unknown User", // Placeholder for now
                CreatedDate = question.CreatedDate,
                LastModifiedDate = question.LastModifiedDate,
                Views = question.Views,
                IsClosed = question.IsClosed,
                Tags = question.Tags
            };
        }

        public async Task<QuestionDto> GetQuestionByIdAsync(Guid id)
        {
            var question = await _questionRepository.GetByIdAsync(id);
            if (question == null) return null;

            question.IncrementViews(); // Business rule: view increments on fetch
            await _questionRepository.UpdateAsync(question); // Persist updated view count

            return new QuestionDto
            {
                Id = question.Id,
                Title = question.Title,
                Content = question.Content,
                CreatedByUserId = question.CreatedByUserId,
                AuthorName = "Unknown User", // Placeholder for now
                CreatedDate = question.CreatedDate,
                LastModifiedDate = question.LastModifiedDate,
                Views = question.Views,
                IsClosed = question.IsClosed,
                Tags = question.Tags
            };
        }

        public async Task<IEnumerable<QuestionDto>> GetAllQuestionsAsync()
        {
            var questions = await _questionRepository.GetAllAsync();
            return questions.Select(q => new QuestionDto
            {
                Id = q.Id,
                Title = q.Title,
                Content = q.Content,
                CreatedByUserId = q.CreatedByUserId,
                AuthorName = "Unknown User", // Placeholder for now
                CreatedDate = q.CreatedDate,
                LastModifiedDate = q.LastModifiedDate,
                Views = q.Views,
                IsClosed = q.IsClosed,
                Tags = q.Tags
            }).ToList();
        }

        public async Task<bool> UpdateQuestionAsync(UpdateQuestionCommand command)
        {
            var question = await _questionRepository.GetByIdAsync(command.Id);
            if (question == null) return false;

            question.Update(command.Title, command.Content, command.Tags);
            await _questionRepository.UpdateAsync(question);
            return true;
        }

        public async Task<bool> DeleteQuestionAsync(Guid id)
        {
            var question = await _questionRepository.GetByIdAsync(id);
            if (question == null) return false;

            await _questionRepository.DeleteAsync(question);
            return true;
        }
    }
}