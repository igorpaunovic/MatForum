using MatForum.UserManagement.Application.DTOs;
using MatForum.UserManagement.Application.Interfaces;
using MatForum.UserManagement.Domain.Entities;
using System.Linq;

namespace MatForum.UserManagement.Application.Services;

public class UserProfileService : IUserProfileService
{
    private readonly IUserProfileRepository _userRepository;
    private readonly IQuestionServiceClient _questionServiceClient;
    private readonly IAnswerServiceClient _answerServiceClient;

    public UserProfileService(
        IUserProfileRepository userRepository,
        IQuestionServiceClient questionServiceClient,
        IAnswerServiceClient answerServiceClient)
    {
        _userRepository = userRepository;
        _questionServiceClient = questionServiceClient;
        _answerServiceClient = answerServiceClient;
    }
    public async Task<UserProfile?> GetById(Guid id)
    {
        return await _userRepository.GetById(id);
    }

    public async Task<IEnumerable<UserProfileDto>> GetAll()
    {
        var users = await _userRepository.GetAll();
        return users.Select(user => new UserProfileDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Username = user.Username,
            DateOfBirth = user.DateOfBirth,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        });
    }

    public async Task<UserProfile> Create(CreateUserProfileDto createUserDto)
    {
        var user = new UserProfile
        {
            Id = createUserDto.Id,
            FirstName = createUserDto.FirstName,
            LastName = createUserDto.LastName,
            Email = createUserDto.Email,
            Username = createUserDto.Username,
            PhoneNumber = createUserDto.PhoneNumber,
            DateOfBirth = createUserDto.DateOfBirth
        };

        return await _userRepository.Create(user);
    }

    public async Task<UserProfile?> Update(Guid id, UpdateUserProfileDto updateUserDto)
    {
        var existingUser = await _userRepository.GetById(id);
        if (existingUser == null)
        {
            return null;
        }
        
        existingUser.FirstName = updateUserDto.FirstName ?? existingUser.FirstName;
        existingUser.LastName = updateUserDto.LastName ?? existingUser.LastName;
        existingUser.Email = updateUserDto.Email ?? existingUser.Email;
        existingUser.Username = updateUserDto.Username ?? existingUser.Username;
        existingUser.DateOfBirth = updateUserDto.DateOfBirth ?? existingUser.DateOfBirth;
        existingUser.UpdatedAt = DateTime.UtcNow;

        return await _userRepository.Update(id, existingUser);
    }

    public async Task<bool> Delete(Guid id)
    {
        await _userRepository.Delete(id);
        return true;
    }

    public async Task<int> GetCount()
    {
        return await _userRepository.GetCount();
    }

    public async Task<IEnumerable<TopContributorDto>> GetTopContributors(int count = 10)
    {
        var allUsers = await _userRepository.GetAll();
        var contributors = new List<TopContributorDto>();

        foreach (var user in allUsers)
        {
            var questionsCount = await _questionServiceClient.GetQuestionCountByUserIdAsync(user.Id);
            var answersCount = await _answerServiceClient.GetAnswerCountByUserIdAsync(user.Id);

            contributors.Add(new TopContributorDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Username = user.Username,
                CreatedAt = user.CreatedAt,
                QuestionsCount = questionsCount,
                AnswersCount = answersCount,
                TotalContributions = questionsCount + answersCount
            });
        }

        return contributors
            .OrderByDescending(c => c.TotalContributions)
            .Take(count);
    }

    public async Task<ContributorProfileDto?> GetContributorProfile(Guid userId)
    {
        var user = await _userRepository.GetById(userId);
        if (user == null) return null;

        var questionsCount = await _questionServiceClient.GetQuestionCountByUserIdAsync(userId);
        var answersCount = await _answerServiceClient.GetAnswerCountByUserIdAsync(userId);
        var userQuestions = await _questionServiceClient.GetQuestionsByUserIdAsync(userId);

        return new ContributorProfileDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Username = user.Username,
            Email = user.Email,
            DateOfBirth = user.DateOfBirth,
            CreatedAt = user.CreatedAt,
            QuestionsCount = questionsCount,
            AnswersCount = answersCount,
            TotalContributions = questionsCount + answersCount,
            Questions = userQuestions.Select(q => new ContributorQuestionDto
            {
                Id = q.Id,
                Title = q.Title,
                Content = q.Content,
                CreatedAt = q.CreatedAt,
                Views = q.Views,
                Tags = q.Tags
            }).ToList()
        };
    }
} 