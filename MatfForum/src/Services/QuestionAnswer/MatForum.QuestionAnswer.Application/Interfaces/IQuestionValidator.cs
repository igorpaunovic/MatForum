namespace MatForum.QuestionAnswer.Application.Interfaces;

public interface IQuestionValidator
{
    Task<bool> ExistsAsync(Guid questionId, CancellationToken cancellationToken);
}