using MatForum.UserManagement.Application.Interfaces;
using MatForum.UserManagement.Domain.Entities;
using MatForum.UserManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MatForum.UserManagement.Infrastructure.Repositories;

public class UserProfileRepository : IUserProfileRepository
{
    private readonly UserManagementDbContext _context;

    public UserProfileRepository(UserManagementDbContext context)
    {
        _context = context;
    }

    public async Task<UserProfile?> GetById(Guid id)
    {
        return await _context.UserProfiles.FindAsync(id);
    }

    public async Task<IEnumerable<UserProfile>> GetAll()
    {
        return await _context.UserProfiles.ToListAsync();
    }

    public async Task<UserProfile> Create(UserProfile user)
    {
        await _context.UserProfiles.AddAsync(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<UserProfile?> Update(Guid id, UserProfile updatedUser)
    {
        var user = await _context.UserProfiles.FindAsync(id);
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
        var user = await _context.UserProfiles.FindAsync(id);
        if (user == null) 
            return false;
     
        _context.UserProfiles.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }
}

