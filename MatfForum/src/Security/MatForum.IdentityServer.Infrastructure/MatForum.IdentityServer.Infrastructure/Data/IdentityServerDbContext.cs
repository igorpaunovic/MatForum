using MatForum.IdentityServer.Domain.Entities;
using MatForum.IdentityServer.Infrastructure.Data.EntityTypeConfigurations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatForum.IdentityServer.Infrastructure.Data
{
    public sealed class IdentityServerDbContext : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>
    {
        public IdentityServerDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ApplyConfiguration(new RoleConfiguration()); // 2 role Admin i User za sad.
        }
    }
}
