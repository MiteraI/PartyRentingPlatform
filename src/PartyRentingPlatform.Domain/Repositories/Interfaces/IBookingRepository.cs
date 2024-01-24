using PartyRentingPlatform.Domain.Entities;
using System;

namespace PartyRentingPlatform.Domain.Repositories.Interfaces
{
    public interface IBookingRepository : IGenericRepository<Booking, long?>
    {
    }
}
