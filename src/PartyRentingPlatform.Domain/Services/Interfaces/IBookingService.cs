using System;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;

namespace PartyRentingPlatform.Domain.Services.Interfaces
{
    public interface IBookingService
    {
        Task<Booking> Save(Booking booking);

        Task<IPage<Booking>> FindAll(IPageable pageable);

        Task<Booking> FindOne(long? id);

        Task Delete(long? id);
    }
}
