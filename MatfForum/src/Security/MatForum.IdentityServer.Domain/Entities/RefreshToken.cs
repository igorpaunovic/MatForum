﻿

namespace MatForum.IdentityServer.Domain.Entities
{
    public class RefreshToken
    {
        public Guid Id { get; set; }
        public string Token { get; set; }
        public DateTime ExpiryTime { get; set; }

        public RefreshToken()
        {
            Id = Guid.NewGuid();
        }
    }
}
