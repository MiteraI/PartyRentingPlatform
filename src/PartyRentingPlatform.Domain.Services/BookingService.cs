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
    protected readonly IServiceRepository _serviceRepository;

    public BookingService(IBookingRepository bookingRepository, IServiceRepository serviceRepository)
    {
        _bookingRepository = bookingRepository;
        _serviceRepository = serviceRepository;
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

    // Find all of one customer's bookings
    public virtual async Task<IPage<Booking>> FindAllForCustomer(string userId, IPageable pageable)
    {
        var page = await _bookingRepository.QueryHelper()
            .Include(booking => booking.Room)
            .Include(booking => booking.User)
            .Filter(booking => booking.UserId == userId)
            .GetPageAsync(pageable);

        return page;
    }

    public virtual async Task<Booking> FindOneForCustomer(long? id)
    {
        var result = await _bookingRepository.QueryHelper()
            .Include(booking => booking.BookingDetails)
            .Include(booking => booking.Room)
            .GetOneAsync(booking => booking.Id == id);

        foreach (var bookingDetail in result.BookingDetails)
        {
            bookingDetail.Service = await _serviceRepository.QueryHelper()
                .GetOneAsync(service => service.Id == bookingDetail.ServiceId);
        }

        return result;
    }

    // Find all bookings that belong to a host from combining all of the host's rooms's bookings
    public virtual async Task<IPage<Booking>> FindAllForHost(string userId, IPageable pageable)
    {
        var page = await _bookingRepository.QueryHelper()
            .Include(booking => booking.Room)
            .Include(booking => booking.User)
            .Filter(booking => booking.Room.UserId == userId)
            .GetPageAsync(pageable);
        return page;
    }

}
