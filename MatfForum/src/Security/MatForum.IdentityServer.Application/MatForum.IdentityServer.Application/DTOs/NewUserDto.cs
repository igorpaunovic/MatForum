using System.ComponentModel.DataAnnotations;


namespace MatForum.IdentityServer.Application.DTOs
{
    public class NewUserDto
    {
        [Required(ErrorMessage = "FirstName is required")]
        public String FirstName { get; set; }

        [Required(ErrorMessage = "LastName is required")]
        public String LastName { get; set; }

        [Required(ErrorMessage = "LastName is required")]
        public String UserName {  get; set; }
        
        [Required(ErrorMessage = "Username is required")]
        public String Password { get; set; }
        
        [Required(ErrorMessage = "Email is required")]
        public String Email { get; set; }
        
        public String? PhoneNumber { get; set; } // Optional
        
    }
}
