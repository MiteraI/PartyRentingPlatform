using System;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Services.Interfaces;
using PartyRentingPlatform.Domain.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace PartyRentingPlatform.Domain.Services;

public class BookingService : IBookingService
{
    protected readonly IBookingRepository _bookingRepository;

    public BookingService(IBookingRepository bookingRepository)
    {
        _bookingRepository = bookingRepository;
    }

    public virtual async Task<Booking> Save(Booking booking)
    {
        await _bookingRepository.CreateOrUpdateAsync(booking);
        await _bookingRepository.SaveChangesAsync();
        return booking;
    }

    public virtual async Task<IPage<Booking>> FindAll(IPageable pageable)
    {
        var page = await _bookingRepository.QueryHelper()
            .Include(booking => booking.Room)
            .Include(booking => booking.User)
            .GetPageAsync(pageable);
        return page;
    }

    public virtual async Task<Booking> FindOne(long? id)
    {
        var result = await _bookingRepository.QueryHelper()
            .Include(booking => booking.Room)
            .Include(booking => booking.User)
            .GetOneAsync(booking => booking.Id == id);
        return result;
    }

    public virtual async Task Delete(long? id)
    {
        await _bookingRepository.DeleteByIdAsync(id);
        await _bookingRepository.SaveChangesAsync();
    }
}
