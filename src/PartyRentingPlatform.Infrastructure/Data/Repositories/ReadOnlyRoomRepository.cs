using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using JHipsterNet.Core.Pagination;
using JHipsterNet.Core.Pagination.Extensions;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Repositories.Interfaces;
using PartyRentingPlatform.Infrastructure.Data.Extensions;

namespace PartyRentingPlatform.Infrastructure.Data.Repositories
{
    public class ReadOnlyRoomRepository : ReadOnlyGenericRepository<Room, long?>, IReadOnlyRoomRepository
    {
        public ReadOnlyRoomRepository(IUnitOfWork context) : base(context)
        {
        }
    }
}
