
using System;
using PartyRentingPlatform.Domain.Entities;


namespace PartyRentingPlatform.Domain.Repositories.Interfaces
{
    public interface IReadOnlyTransactionRepository : IReadOnlyGenericRepository<Transaction, long?>
    {
    }
}
