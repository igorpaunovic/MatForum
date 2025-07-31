using MatForum.UserManagement.Application.DTOs;
using MatForum.UserManagement.Domain.Entities;

namespace MatForum.UserManagement.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetById(Guid id);
    Task<IEnumerable<User>> GetAll();
    Task<User> Create(User user);
    Task<User?> Update(Guid id, User user);
    Task<bool> Delete(Guid id);
} 