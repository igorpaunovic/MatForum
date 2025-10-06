using MatForum.QuestionAnswer.Application.Interfaces;
using MatForum.QuestionAnswer.Domain.Entities;
using MatForum.QuestionAnswer.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MatForum.QuestionAnswer.Infrastructure.Repositories;

public class AnswerRepository : IAnswerRepository
{
    private readonly QuestionAnswerDbContext _context;

    public AnswerRepository(QuestionAnswerDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Answer answer, CancellationToken cancellationToken)
    {
        await _context.Answers.AddAsync(answer, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task<Answer?> GetByIdAsync(Guid answerId, CancellationToken cancellationToken)
    {
        return await _context.Answers.FindAsync(new object[] { answerId }, cancellationToken);
    }

    public async Task<IEnumerable<Answer>> GetByQuestionIdAsync(Guid questionId, CancellationToken cancellationToken)
    {
        return await _context.Answers
            .Where(a => a.QuestionId == questionId)
            .ToListAsync(cancellationToken);
    }
}