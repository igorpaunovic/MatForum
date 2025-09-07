using Microsoft.EntityFrameworkCore;
using MatForum.ForumQuestion.Domain.Entities;

namespace MatForum.ForumQuestion.Infrastructure.Data
{
    public class QuestionDbContext : DbContext
    {
        public QuestionDbContext(DbContextOptions<QuestionDbContext> options) : base(options)
        {
        }

        public DbSet<Question> Questions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Question>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedNever(); // We generate GUIDs in the domain
                
                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(500);
                
                entity.Property(e => e.Content)
                    .IsRequired();
                
                entity.Property(e => e.CreatedByUserId)
                    .IsRequired();
                
                entity.Property(e => e.CreatedDate)
                    .IsRequired();
                
                entity.Property(e => e.LastModifiedDate)
                    .IsRequired();
                
                entity.Property(e => e.Views)
                    .IsRequired()
                    .HasDefaultValue(0);
                
                entity.Property(e => e.IsClosed)
                    .IsRequired()
                    .HasDefaultValue(false);
                
                entity.Property(e => e.Tags)
                    .HasColumnType("text[]"); // PostgreSQL array type
                
                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("NOW()");
                
                entity.Property(e => e.UpdatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("NOW()");

                // Create indexes
                entity.HasIndex(e => e.CreatedByUserId);
                entity.HasIndex(e => e.CreatedDate);
                entity.HasIndex(e => e.IsClosed);
                entity.HasIndex(e => e.Views);
            });
        }
    }
}
