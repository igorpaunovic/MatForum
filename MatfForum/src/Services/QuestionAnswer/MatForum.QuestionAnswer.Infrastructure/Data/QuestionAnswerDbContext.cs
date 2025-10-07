using Microsoft.EntityFrameworkCore;
using MatForum.QuestionAnswer.Domain.Entities;

namespace MatForum.QuestionAnswer.Infrastructure.Data;

public class QuestionAnswerDbContext : DbContext
{
    public QuestionAnswerDbContext(DbContextOptions<QuestionAnswerDbContext> options) : base(options) { }

    public DbSet<Answer> Answers { get; set; }

    // ... OnModelCreating etc.
}