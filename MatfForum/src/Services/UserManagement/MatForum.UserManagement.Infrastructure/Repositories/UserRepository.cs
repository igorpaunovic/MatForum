using MatForum.UserManagement.Application.Interfaces;
using MatForum.UserManagement.Domain.Entities;
using MatForum.UserManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MatForum.UserManagement.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly UserManagementDbContext _context;

    public UserRepository(UserManagementDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetById(Guid id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<IEnumerable<User>> GetAll()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<User> Create(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User?> Update(Guid id, User updatedUser)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return null;
        user.FirstName = updatedUser.FirstName;
        user.LastName = updatedUser.LastName;
        user.Email = updatedUser.Email;
        user.Username = updatedUser.Username;
        user.DateOfBirth = updatedUser.DateOfBirth;
        user.UpdatedAt = updatedUser.UpdatedAt;
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<bool> Delete(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) 
            return false;
     
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }
}

