using System;
using System.Threading;
using System.Threading.Tasks;
using MatForum.ForumQuestion.Application.DTOs;

namespace MatForum.ForumQuestion.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserDto?> GetByIdAsync(Guid userId);
        Task<bool> ExistsAsync(Guid userId);
    }
}
