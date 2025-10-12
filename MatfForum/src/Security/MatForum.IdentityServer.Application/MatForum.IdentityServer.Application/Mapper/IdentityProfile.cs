using MatForum.IdentityServer.Application.DTOs;
using AutoMapper;
using MatForum.IdentityServer.Domain.Entities;

namespace MatForum.IdentityServer.Application.Mapper
{
    public class IdentityProfile : Profile
    {
        public IdentityProfile()
        {
            CreateMap<AppUser, NewUserDto>().ReverseMap();
            CreateMap<AppUser, UserDetailsDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)));
        }
    }
}
