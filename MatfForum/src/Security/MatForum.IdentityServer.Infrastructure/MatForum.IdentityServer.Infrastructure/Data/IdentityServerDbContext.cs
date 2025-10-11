using MatForum.IdentityServer.Domain.Entities;
using MatForum.IdentityServer.Infrastructure.Data.EntityTypeConfigurations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatForum.IdentityServer.Infrastructure.Data
{
    public sealed class IdentityServerDbContext : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>
    {
        public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;

        public IdentityServerDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ApplyConfiguration(new RoleConfiguration()); // 2 role Admin i User za sad.
            builder.ApplyConfiguration(new AppUserConfiguration());
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Suppress PendingModelChangesWarning
            //optionsBuilder.ConfigureWarnings(warnings =>
                //warnings.Ignore(RelationalEventId.PendingModelChangesWarning));


            base.OnConfiguring(optionsBuilder);
        }
    }
}
