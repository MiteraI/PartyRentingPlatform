using System;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Crosscutting.Enums;
using PartyRentingPlatform.Domain.Entities;

namespace PartyRentingPlatform.Domain.Services.Interfaces
{
    public interface IBookingService
    {
        Task<Booking> Save(Booking booking);

        Task<IPage<Booking>> FindAll(IPageable pageable);

        Task<Booking> FindOne(long? id);

        Task Delete(long? id);

        Task<IPage<Booking>> FindAllForCustomer(string userId, IPageable pageable);

        Task<Booking> FindOneForCustomer(long? id);

        Task<IPage<Booking>> FindAllForHost(string userId, IPageable pageable);

        Task<Booking> FindOneForHost(long? id);

        Task<IPage<Booking>> FindAllForHostByStatus(string userId, BookingStatus bookingStatus, IPageable pageable);
    }
}
