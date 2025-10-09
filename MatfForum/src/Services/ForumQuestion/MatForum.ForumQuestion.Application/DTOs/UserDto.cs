using System;
using System.Text.Json.Serialization;

namespace MatForum.ForumQuestion.Application.DTOs
{
    public class UserDto
    {
        [JsonPropertyName("id")]
        public Guid Id { get; set; }
        [JsonPropertyName("username")]
        public string Username { get; set; } = string.Empty;
    }
}
