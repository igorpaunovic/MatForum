using MatForum.UserManagement.Application.DTOs;
using MatForum.UserManagement.Domain.Entities;

namespace MatForum.UserManagement.Application.Interfaces;

public interface IUserProfileService
{
    Task<UserProfile?> GetById(Guid id);
    Task<IEnumerable<UserProfileDto>> GetAll();
    Task<UserProfile> Create(CreateUserProfileDto createUserDto);
    Task<UserProfile?> Update(Guid id, UpdateUserProfileDto updateUserDto);
    Task<bool> Delete(Guid id);
    Task<int> GetCount();
    Task<IEnumerable<TopContributorDto>> GetTopContributors(int count = 10);
    Task<ContributorProfileDto?> GetContributorProfile(Guid userId);
} 