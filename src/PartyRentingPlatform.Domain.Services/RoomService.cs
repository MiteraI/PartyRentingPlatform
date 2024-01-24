using System;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Services.Interfaces;
using PartyRentingPlatform.Domain.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace PartyRentingPlatform.Domain.Services;

public class RoomService : IRoomService
{
    protected readonly IRoomRepository _roomRepository;

    public RoomService(IRoomRepository roomRepository)
    {
        _roomRepository = roomRepository;
    }

    public virtual async Task<Room> Save(Room room)
    {
        await _roomRepository.CreateOrUpdateAsync(room);
        await _roomRepository.SaveChangesAsync();
        return room;
    }

    public virtual async Task<IPage<Room>> FindAll(IPageable pageable)
    {
        var page = await _roomRepository.QueryHelper()
            .Include(room => room.User)
            .Include(room => room.Promotions)
            .Include(room => room.Services)
            .GetPageAsync(pageable);
        return page;
    }

    public virtual async Task<Room> FindOne(long? id)
    {
        var result = await _roomRepository.QueryHelper()
            .Include(room => room.User)
            .Include(room => room.Promotions)
            .Include(room => room.Services)
            .GetOneAsync(room => room.Id == id);
        return result;
    }

    public virtual async Task Delete(long? id)
    {
        await _roomRepository.DeleteByIdAsync(id);
        await _roomRepository.SaveChangesAsync();
    }
}
