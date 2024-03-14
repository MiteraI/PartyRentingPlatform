
using AutoMapper;
using System.Linq;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Dto;
using PartyRentingPlatform.Dto.Booking;
using PartyRentingPlatform.Dto.Room;
using PartyRentingPlatform.Dto.Service;
using PartyRentingPlatform.Dto.Profile;


namespace PartyRentingPlatform.Configuration.AutoMapper
{

    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>()
                .ForMember(userDto => userDto.Roles, opt => opt.MapFrom(user => user.UserRoles.Select(iur => iur.Role.Name).ToHashSet()))
            .ReverseMap()
                .ForPath(user => user.UserRoles, opt => opt.MapFrom(userDto => userDto.Roles.Select(role => new UserRole { Role = new Role { Name = role }, UserId = userDto.Id }).ToHashSet()));
            CreateMap<User, UserAppDto>().ReverseMap();
            CreateMap<User, ProfileDto>()
                .ForMember(profileDto => profileDto.Roles, opt => opt.MapFrom(user => user.UserRoles.Select(iur => iur.Role.Name).ToHashSet()))
            .ReverseMap()
                .ForPath(user => user.UserRoles, opt => opt.MapFrom(profileDto => profileDto.Roles.Select(role => new UserRole { Role = new Role { Name = role }, UserId = profileDto.Id }).ToHashSet()));

            // Room mappings
            CreateMap<Room, RoomDto>().ReverseMap();
            CreateMap<RoomHostDto, Room>().ReverseMap();

            // RoomImage mappings
            CreateMap<RoomImage, RoomImageDto>().ReverseMap();

            // Service mappings
            CreateMap<Service, ServiceDto>().ReverseMap();
            CreateMap<Service, RoomServiceHostDto>().ReverseMap();
            CreateMap<Service, ServiceHostDto>().ReverseMap();

            // Promotion mappings
            CreateMap<Promotion, PromotionDto>().ReverseMap();
            CreateMap<Promotion, RoomPromoDto>().ReverseMap();

            // Booking mappings
            CreateMap<Booking, BookingDto>().ReverseMap();
            CreateMap<Booking, BookingRatingDto>().ReverseMap();
            CreateMap<Booking, BookingCustomerDto>().ReverseMap();

            CreateMap<BookingDetails, BookingDetailCustomerDto>()
                .ForMember(dest => dest.ServiceQuantity, opt => opt.MapFrom(src => src.ServiceQuantity))
                .ForMember(dest => dest.ServiceId, opt => opt.MapFrom(src => src.ServiceId))
                .ReverseMap();

            // Report mappings
            CreateMap<Report, ReportDto>().ReverseMap();

            // Notification mappings
            CreateMap<Notification, NotificationDto>().ReverseMap();
            CreateMap<Notification, NotifyDto>().ReverseMap();
        }
    }
}
