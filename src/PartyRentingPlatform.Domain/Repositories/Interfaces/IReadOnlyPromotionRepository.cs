
using System;
using PartyRentingPlatform.Domain.Entities;

namespace PartyRentingPlatform.Domain.Repositories.Interfaces
{

    public interface IReadOnlyPromotionRepository : IReadOnlyGenericRepository<Promotion, long?>
    {
    }

}
