using Microsoft.EntityFrameworkCore;
using MatForum.UserManagement.Domain.Entities;

namespace MatForum.UserManagement.Infrastructure.Data;

public class UserManagementDbContext : DbContext
{
    public UserManagementDbContext(DbContextOptions<UserManagementDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }

    // ... OnModelCreating etc.
}

