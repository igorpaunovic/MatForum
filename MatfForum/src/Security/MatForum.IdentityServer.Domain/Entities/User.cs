using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatForum.IdentityServer.Domain.Entities
{
    public sealed class AppUser : IdentityUser<Guid>
    {
        // IdentityUser genericka klasa za korisnike? // svasta nesto 
        // Id su stringovi 
        // prreslikavanje preko entity framework cora? 
        // kako premapirati? 
    }
}
