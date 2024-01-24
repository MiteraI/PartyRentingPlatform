
using System;
using PartyRentingPlatform.Domain.Entities;

namespace PartyRentingPlatform.Domain.Repositories.Interfaces
{

    public interface IReadOnlyRoomRepository : IReadOnlyGenericRepository<Room, long?>
    {
    }

}
