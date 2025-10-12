using MatForum.Shared.Domain.Common;

namespace MatForum.Shared.Domain.Interfaces;

public interface IGenericRepository<T> where T : BaseEntity
{
    Task<T?> GetById(Guid id);
    Task<IEnumerable<T>> GetAll();
    Task<T> Create(T entity);
    Task<T?> Update(Guid id, T entity);
    Task<bool> Delete(Guid id);
    Task<int> GetCount();
} 