using MatForum.UserManagement.Domain.Entities;
using MatForum.UserManagement.Application.Interfaces;
using MatForum.Shared.Infrastructure.Repositories;

namespace MatForum.UserManagement.Infrastructure.Repositories;

public class UserRepository : GenericRepository<User>, IUserRepository
{}