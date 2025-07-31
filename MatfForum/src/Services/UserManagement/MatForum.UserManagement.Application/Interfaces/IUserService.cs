using MatForum.UserManagement.Application.DTOs;
using MatForum.UserManagement.Domain.Entities;

namespace MatForum.UserManagement.Application.Interfaces;

public interface IUserService
{
    Task<User?> GetById(Guid id);
    Task<IEnumerable<UserDto>> GetAll();
    Task<User> Create(CreateUserDto createUserDto);
    Task<User?> Update(Guid id, UpdateUserDto updateUserDto);
    Task<bool> Delete(Guid id);
} 