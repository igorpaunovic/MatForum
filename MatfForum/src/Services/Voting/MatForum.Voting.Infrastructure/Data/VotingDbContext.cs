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
                entity.Property(e => e.Id).ValueGeneratedNever(); // We generate GUIDs in the domain
                
                entity.Property(e => e.QuestionId)
                    .IsRequired();
                
                entity.Property(e => e.UserId)
                    .IsRequired();
                
                entity.Property(e => e.VoteType)
                    .IsRequired()
                    .HasConversion<int>(); // Convert enum to int
                
                entity.Property(e => e.CreatedDate)
                    .IsRequired();
                
                entity.Property(e => e.LastModifiedDate)
                    .IsRequired();
                
                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("NOW()");
                
                entity.Property(e => e.UpdatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("NOW()");

                // Create unique constraint for one vote per user per question
                entity.HasIndex(e => new { e.QuestionId, e.UserId })
                    .IsUnique();

                // Create indexes for better performance
                entity.HasIndex(e => e.QuestionId);
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.VoteType);
            });
        }
    }
}
