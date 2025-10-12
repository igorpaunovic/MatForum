using System;
using System.Threading.Tasks;

namespace MatForum.UserManagement.Application.Interfaces
{
    public interface IAnswerServiceClient
    {
        Task<int> GetAnswerCountByUserIdAsync(Guid userId);
    }
}

