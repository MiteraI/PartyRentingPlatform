using System;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Services.Interfaces;
using PartyRentingPlatform.Domain.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using PartyRentingPlatform.Crosscutting.Enums;

namespace PartyRentingPlatform.Domain.Services;

public class RoomService : IRoomService
{
    protected readonly IRoomRepository _roomRepository;
    protected readonly IServiceRepository _serviceRepository;

    public RoomService(IRoomRepository roomRepository, IServiceRepository serviceRepository)
    {
        _roomRepository = roomRepository;
        _serviceRepository = serviceRepository;
    }

    public virtual async Task<Room> Save(Room room)
    {
        for (int i = 0; i < room.Services.Count; i++)
        {
            var originalService = await _serviceRepository.GetOneAsync(room.Services[i].Id);
            room.Services[i] = originalService;
        }
        // TODO: Do the same for promotions

        await _roomRepository.CreateOrUpdateAsync(room);
        await _roomRepository.SaveChangesAsync();
        return room;
    }

    public virtual async Task<IPage<Room>> FindAll(IPageable pageable)
    {
        var page = await _roomRepository.QueryHelper()
            .Include(room => room.User)
            .Include(room => room.ImageURLs)
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

    // List of room with imageUrls to display in the home page
    public virtual async Task<IPage<Room>> FindAllValidWithImageUrls(IPageable pageable)
    {
        var page = await _roomRepository.QueryHelper()
            .Include(room => room.ImageURLs)
            .Filter(room => room.Status == RoomStatus.VALID)
            .GetPageAsync(pageable);
        return page;
    }

    // For host to see their rooms
    public virtual async Task<IPage<Room>> FindAllByHostId(string userId, IPageable pageable)
    {
        var page = await _roomRepository.QueryHelper()
            .Filter(room => room.UserId == userId)
            .GetPageAsync(pageable);
        return page;
    }

    public virtual async Task<Room> FindOneWithFullDetails(long? id)
    {
        var result = await _roomRepository.QueryHelper()
            .Include(room => room.User)
            .Include(room => room.ImageURLs)
            .Include(room => room.Promotions)
            .Include(room => room.Services)
            .GetOneAsync(room => room.Id == id);
        return result;
    }
}
