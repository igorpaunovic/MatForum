using MatForum.Shared.Domain.Common;
using MatForum.Shared.Domain.Interfaces;

namespace MatForum.Shared.Infrastructure.Repositories;

public abstract class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
{
    private readonly List<T> _entities = [];

    public virtual async Task<T?> GetById(Guid id)
    {
        return await Task.FromResult(_entities.FirstOrDefault(e => e.Id == id));
    }

    public virtual async Task<IEnumerable<T>> GetAll()
    {
        return await Task.FromResult(_entities.AsEnumerable());
    }

    public virtual async Task<T> Create(T entity)
    {
        if (entity.Id == Guid.Empty)
            entity.Id = Guid.NewGuid();
        
        if (_entities.Any(e => e.Id == entity.Id))
        {
            throw new InvalidOperationException($"Entity with ID {entity.Id} already exists.");
        }
        
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;
        
        _entities.Add(entity);
        return await Task.FromResult(entity);
    }
    
    private static void UpdateEntityFields(T existing, T payload)
    {
        var properties = typeof(T).GetProperties()
            .Where(property => property.CanWrite && 
                               property.Name != nameof(BaseEntity.Id) &&
                               property.Name != nameof(BaseEntity.CreatedAt) &&
                               property.Name != nameof(BaseEntity.UpdatedAt));

        foreach (var property in properties)
        {
            var payloadValue = property.GetValue(payload);
            if (payloadValue != null)
            {
                property.SetValue(existing, payloadValue);
            }
        }
    }

    public virtual async Task<T?> Update(Guid id, T entity)
    {
        var index = _entities.FindIndex(e => e.Id == id);
        if (index < 0)
        {
            return null;
        }
        
        var existingEntity = _entities[index];
        UpdateEntityFields(existingEntity, entity);
        existingEntity.UpdatedAt = DateTime.UtcNow;
        
        return await Task.FromResult(existingEntity);
    }

    public virtual async Task<bool> Delete(Guid id)
    {
        var entity = _entities.FirstOrDefault(e => e.Id == id);
        if (entity != null)
        {
            _entities.Remove(entity);
            return await Task.FromResult(true);
        }
        return await Task.FromResult(false);
    }

    public virtual async Task<int> GetCount()
    {
        return await Task.FromResult(_entities.Count);
    }
}