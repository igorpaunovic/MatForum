using Microsoft.AspNetCore.Identity;


namespace MatForum.IdentityServer.Domain.Entities
{
    public class AppUser : IdentityUser<Guid>
    {
        // IdentityUser genericka klasa za korisnike? // svasta nesto 
        // Id su stringovi 
        // prreslikavanje preko entity framework cora? 
        // kako premapirati? 

        public string FirstName { get; set; }  // dodato 
        public string LastName { get; set; }  // dodato 
        public List<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }

}
