using Microsoft.EntityFrameworkCore;
using MatForum.UserManagement.Domain.Entities;

namespace MatForum.UserManagement.Infrastructure.Data;

public class UserManagementDbContext : DbContext
{
    public UserManagementDbContext(DbContextOptions<UserManagementDbContext> options) : base(options) { }

    public DbSet<UserProfile> UserProfiles { get; set; }

    // ... OnModelCreating etc.

    protected override void OnModelCreating(ModelBuilder b)
    {
        base.OnModelCreating(b);

        b.Entity<UserProfile>(e =>
        {
            e.ToTable("user_profiles");   // here
            e.HasKey(x => x.Id);
            e.Property(x => x.Email).HasMaxLength(256);
            e.Property(x => x.Username).HasMaxLength(64);
        });
    }
}

