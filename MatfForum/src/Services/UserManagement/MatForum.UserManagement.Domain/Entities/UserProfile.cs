using MatForum.Shared.Domain.Common;

namespace MatForum.UserManagement.Domain.Entities;

public class UserProfile : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
}