namespace MatForum.QuestionAnswer.Application.Interfaces
{
    public interface IUserService
    {
        Task<bool> ExistsAsync(Guid userId, CancellationToken cancellationToken);
    }
}

