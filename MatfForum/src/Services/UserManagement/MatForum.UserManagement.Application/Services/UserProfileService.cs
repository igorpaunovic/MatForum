using MatForum.UserManagement.Application.DTOs;
using MatForum.UserManagement.Application.Interfaces;
using MatForum.UserManagement.Domain.Entities;

namespace MatForum.UserManagement.Application.Services;

public class UserProfileService(IUserProfileRepository userRepository) : IUserProfileService
{
    public async Task<UserProfile?> GetById(Guid id)
    {
        return await userRepository.GetById(id);
    }

    public async Task<IEnumerable<UserProfileDto>> GetAll()
    {
        var users = await userRepository.GetAll();
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

        return await userRepository.Create(user);
    }

    public async Task<UserProfile?> Update(Guid id, UpdateUserProfileDto updateUserDto)
    {
        var existingUser = await userRepository.GetById(id);
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

        return await userRepository.Update(id, existingUser);
    }

    public async Task<bool> Delete(Guid id)
    {
        await userRepository.Delete(id);
        return true;
    }
} 