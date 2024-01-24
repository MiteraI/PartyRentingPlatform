
using System;
using PartyRentingPlatform.Domain.Entities;

namespace PartyRentingPlatform.Domain.Repositories.Interfaces
{

    public interface IReadOnlyBookingRepository : IReadOnlyGenericRepository<Booking, long?>
    {
    }

}
