using MatForum.QuestionAnswer.Application.Interfaces;
using MatForum.Shared.Domain.Interfaces;
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

    public async Task<Answer?> GetById(Guid id)
    {
        return await _context.Answers
            .Where(a => !a.IsDeleted)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<IEnumerable<Answer>> GetAll()
    {
        return await _context.Answers
            .Where(a => !a.IsDeleted)
            .ToListAsync();
    }

    public async Task<Answer> Create(Answer entity)
    {
        await _context.Answers.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<Answer?> Update(Guid id, Answer entity)
    {
        var existingAnswer = await _context.Answers.FindAsync(id);
        if (existingAnswer == null) return null;

        _context.Entry(existingAnswer).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
        return existingAnswer;
    }

    public async Task<bool> Delete(Guid id)
    {
        var answer = await _context.Answers.FindAsync(id);
        if (answer == null) return false;

        // Soft delete
        answer.Delete();
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Answer>> GetByQuestionIdAsync(Guid questionId)
    {
        return await _context.Answers
            .Where(a => !a.IsDeleted && a.QuestionId == questionId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Answer>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Answers
            .Where(a => !a.IsDeleted && a.AuthorId == userId)
            .ToListAsync();
    }

    public async Task<int> GetCount()
    {
        return await _context.Answers
            .Where(a => !a.IsDeleted)
            .CountAsync();
    }
}