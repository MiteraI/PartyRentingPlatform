using System;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Services.Interfaces;
using PartyRentingPlatform.Domain.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using PartyRentingPlatform.Crosscutting.Enums;
using System.Collections.Generic;

namespace PartyRentingPlatform.Domain.Services;

public class RoomService : IRoomService
{
    protected readonly IRoomRepository _roomRepository;
    protected readonly IBookingRepository _bookingRepository;
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

    public async Task<IPage<Room>> FindAllByRoomNameAndRatingAndAddress(string roomName, int? rating, string? address, IPageable pageable)
    {
        if (rating == null && address == null)
        {
            return await _roomRepository.QueryHelper()
                       .Include(room => room.User)
                       .Include(room => room.ImageURLs)
                       .Filter(room => room.RoomName.Contains(roomName))
                       .GetPageAsync(pageable);
        } else if (rating == null)
        {
            return await _roomRepository.QueryHelper()
                       .Include(room => room.User)
                       .Include(room => room.ImageURLs)
                       .Filter(room => room.Address.Contains(address))
                       .Filter(room => room.RoomName.Contains(roomName))
                       .GetPageAsync(pageable);
        } else if (address == null)
        {
            return await _roomRepository.QueryHelper()
                       .Include(room => room.User)
                       .Include(room => room.ImageURLs)
                       .Filter(room => room.Rating > rating)
                       .Filter(room => room.RoomName.Contains(roomName))
                       .GetPageAsync(pageable);
        } else
        {
            return await _roomRepository.QueryHelper()
                       .Include(room => room.User)
                       .Include(room => room.ImageURLs)
                       .Filter(room => room.Rating == rating && room.Address.Contains(address))
                       .Filter(room => room.RoomName.Contains(roomName))
                       .Filter(room => room.Rating > rating)
                       .GetPageAsync(pageable);
        }

    }

    public async Task UpdateRating(long? id, int rating)
    {
        var room = await _roomRepository.GetOneAsync(id);
        // Get all bookings of this room and calculate the average of all ratings with floor rounded while ignore null ratings
        var bookings = await GetBookingsOfRoom(id);
        int totalRating = 0;
        int count = 0;
        foreach (var booking in bookings)
        {
            if (booking.Rating != null)
            {
                totalRating += (int)booking.Rating;
                count++;
            }
        }
        if (count != 0)
        {
            room.Rating = (int)Math.Floor((double)totalRating / count);
        }
        else
        {
            room.Rating = 0;
        }
        await _roomRepository.SaveChangesAsync();
    }

    private async Task<IEnumerable<Booking>> GetBookingsOfRoom(long? id)
    {
        return await _bookingRepository.QueryHelper()
            .Filter(booking => booking.RoomId == id)
            .GetAllAsync();
    }
}
