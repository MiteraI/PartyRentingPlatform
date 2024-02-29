
using AutoMapper;
using System.Linq;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Dto;
using PartyRentingPlatform.Dto.Booking;
using PartyRentingPlatform.Dto.Room;
using PartyRentingPlatform.Dto.Service;


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

            // Room mappings
            CreateMap<Room, RoomDto>().ReverseMap();
            CreateMap<RoomHostDto, Room>()
               .ForMember(dest => dest.RoomName, opt => opt.MapFrom(src => src.RoomName))
               .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
               .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
               .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
               .ForMember(dest => dest.RoomCapacity, opt => opt.MapFrom(src => src.RoomCapacity))
               .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Rating))
               .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
               .ForMember(dest => dest.ImageURLs, opt => opt.MapFrom(src => src.ImageURLs))
               .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
               .ReverseMap();

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
            CreateMap<Booking, BookingCustomerDto>()
                .ForMember(dest => dest.Room, opt => opt.MapFrom(src => src.Room))
                .ForMember(dest => dest.BookingDetails, opt => opt.MapFrom(src => src.BookingDetails))
                .ReverseMap();

            CreateMap<BookingDetails, BookingDetailCustomerDto>()
                .ForMember(dest => dest.ServiceQuantity, opt => opt.MapFrom(src => src.ServiceQuantity))
                .ForMember(dest => dest.ServiceId, opt => opt.MapFrom(src => src.ServiceId))
                .ReverseMap();

            // Report mappings
            CreateMap<Report, ReportDto>().ReverseMap();

            // Notification mappings
            CreateMap<Notification, NotificationDto>().ReverseMap();
        }
    }
}
