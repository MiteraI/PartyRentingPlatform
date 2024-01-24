
using System;
using PartyRentingPlatform.Domain.Entities;

namespace PartyRentingPlatform.Domain.Repositories.Interfaces
{

    public interface IReadOnlyBookingDetailsRepository : IReadOnlyGenericRepository<BookingDetails, long?>
    {
    }

}
