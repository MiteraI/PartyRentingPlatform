using System;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;

namespace PartyRentingPlatform.Domain.Services.Interfaces
{
    public interface IRoomService
    {
        Task<Room> Save(Room room);

        Task<IPage<Room>> FindAll(IPageable pageable);

        Task<Room> FindOne(long? id);

        Task Delete(long? id);
    }
}
