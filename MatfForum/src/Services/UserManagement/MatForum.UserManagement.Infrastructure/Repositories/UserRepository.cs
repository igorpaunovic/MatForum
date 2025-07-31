using MatForum.UserManagement.Domain.Entities;
using MatForum.UserManagement.Application.Interfaces;

namespace MatForum.UserManagement.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private static readonly List<User> Users = new();
    
    public async Task<User?> GetById(Guid id)
    {
        return await Task.FromResult(Users.FirstOrDefault(u => u.Id == id));
    }
    
    public async Task<IEnumerable<User>> GetAll()
    {
        return await Task.FromResult(Users.AsEnumerable());
    }
    
    public async Task<User> Create(User user)
    {
        if (user.Id == Guid.Empty)
            user.Id = Guid.NewGuid();
        
        user.CreatedAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;
        
        Users.Add(user);
        return await Task.FromResult(user);
    }
    
    public async Task<User?> Update(Guid id, User user)
    {
        var existingUserIndex = Users.FindIndex(u => u.Id == user.Id);
        if (existingUserIndex >= 0)
        {
            user.UpdatedAt = DateTime.UtcNow;
            Users[existingUserIndex] = user;
        }
        return await Task.FromResult(user);
    }
    
    public async Task<bool> Delete(Guid id)
    {
        var user = Users.FirstOrDefault(u => u.Id == id);
        if (user != null)
        {
            Users.Remove(user);
        }
        await Task.CompletedTask;
        return true;
    }
}