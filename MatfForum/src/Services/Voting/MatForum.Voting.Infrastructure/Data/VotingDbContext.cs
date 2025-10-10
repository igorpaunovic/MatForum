using MatForum.Shared.Domain.Common;
using Microsoft.EntityFrameworkCore;
using MatForum.Voting.Domain.Entities;

namespace MatForum.Voting.Infrastructure.Data
{
    public class VotingDbContext : DbContext
    {
        public VotingDbContext(DbContextOptions<VotingDbContext> options) : base(options)
        {
        }

        public DbSet<Vote> Votes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Vote>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedNever();
                
                entity.Property(e => e.QuestionId).IsRequired(false); // Can be null for answer votes
                entity.Property(e => e.AnswerId).IsRequired(false); // Can be null for question votes
                entity.Property(e => e.UserId).IsRequired();
                
                entity.Property(e => e.VoteType)
                    .IsRequired()
                    .HasConversion<int>();
                
                // Use timestamp without time zone to avoid DateTime Kind issues
                entity.Property(e => e.CreatedAt)
                    .HasColumnName("CreatedAt")
                    .HasColumnType("timestamp without time zone")
                    .IsRequired();
                
                entity.Property(e => e.UpdatedAt)
                    .HasColumnName("UpdatedAt")
                    .HasColumnType("timestamp without time zone")
                    .IsRequired();

                // Unique constraints
                entity.HasIndex(e => new { e.QuestionId, e.UserId })
                    .IsUnique()
                    .HasFilter("\"QuestionId\" IS NOT NULL"); // Only for question votes
                    
                entity.HasIndex(e => new { e.AnswerId, e.UserId })
                    .IsUnique()
                    .HasFilter("\"AnswerId\" IS NOT NULL"); // Only for answer votes

                // Performance indexes
                entity.HasIndex(e => e.QuestionId);
                entity.HasIndex(e => e.AnswerId);
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.VoteType);
            });
        }
    }
}
