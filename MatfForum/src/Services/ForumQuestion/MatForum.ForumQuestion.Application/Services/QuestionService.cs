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
    /// <summary>
    /// Servis za upravljanje forum pitanjima
    /// </summary>
    /// <remarks>
    /// Implementira IForumQuestionService interfejs i pruža funkcionalnosti
    /// za kreiranje, čitanje, ažuriranje i brisanje pitanja.
    /// Komunicira sa User servisom i Answer servisom preko HTTP klijenata.
    /// </remarks>
    public class ForumQuestionService : IForumQuestionService
    {
        private readonly IQuestionRepository _questionRepository;
        private readonly IUserService _userService;
        private readonly IAnswerServiceClient _answerServiceClient;

        /// <summary>
        /// Konstruktor za ForumQuestionService
        /// </summary>
        /// <param name="questionRepository">Repository za pristup pitanjima u bazi</param>
        /// <param name="userService">Servis za komunikaciju sa User mikroservisom</param>
        /// <param name="answerServiceClient">Klijent za komunikaciju sa Answer mikroservisom</param>
        public ForumQuestionService(IQuestionRepository questionRepository, IUserService userService, IAnswerServiceClient answerServiceClient)
        {
            _questionRepository = questionRepository;
            _userService = userService;
            _answerServiceClient = answerServiceClient;
        }

        /// <summary>
        /// Kreira novo forum pitanje
        /// </summary>
        /// <param name="command">Komanda sa podacima za kreiranje pitanja</param>
        /// <returns>DTO kreiranog pitanja sa svim podacima uključujući ime autora</returns>
        /// <exception cref="InvalidOperationException">Baca se kada korisnik ne postoji</exception>
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

        public async Task<IEnumerable<QuestionDto>> SearchQuestions(string searchTerm)
        {
            var questions = await _questionRepository.SearchQuestions(searchTerm);
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

        /// <summary>
        /// Briše pitanje i sve povezane odgovore (cascade delete)
        /// </summary>
        /// <param name="id">ID pitanja koje treba obrisati</param>
        /// <returns>True ako je pitanje uspešno obrisano, false ako pitanje ne postoji</returns>
        /// <remarks>
        /// Prvo briše sve odgovore povezane sa pitanjem pozivom Answer servisa,
        /// zatim briše samo pitanje. Ovo osigurava integritet podataka.
        /// </remarks>
        public async Task<bool> DeleteQuestion(Guid id)
        {
            var question = await _questionRepository.GetById(id);
            if (question == null) return false;
            
            // Cascade delete: Delete all answers for this question first
            await _answerServiceClient.DeleteAnswersByQuestionIdAsync(id);
            
            // Then delete the question
            await _questionRepository.Delete(id);
            return true;
        }

        public async Task<IEnumerable<QuestionDto>> GetSimilarQuestions(Guid questionId, int count = 3)
        {
            var questions = await _questionRepository.GetSimilarQuestions(questionId, count);
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

        public async Task<int> GetCount()
        {
            return await _questionRepository.GetCount();
        }

        public async Task<IEnumerable<QuestionDto>> GetQuestionsByUserId(Guid userId)
        {
            var userQuestions = await _questionRepository.GetByUserIdAsync(userId);
            var dtos = new List<QuestionDto>();
            foreach (var question in userQuestions)
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
    }
}
