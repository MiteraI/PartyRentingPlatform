
using System;
using System.Threading;
using System.Collections.Generic;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Crosscutting.Enums;
using PartyRentingPlatform.Crosscutting.Exceptions;
using PartyRentingPlatform.Dto;
using PartyRentingPlatform.Web.Extensions;
using PartyRentingPlatform.Web.Rest.Utilities;
using AutoMapper;
using System.Linq;
using PartyRentingPlatform.Domain.Repositories.Interfaces;
using PartyRentingPlatform.Domain.Services.Interfaces;
using PartyRentingPlatform.Infrastructure.Web.Rest.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace PartyRentingPlatform.Controllers
{
    [Authorize]
    [Route("api/bookings")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private const string EntityName = "booking";
        private readonly ILogger<BookingsController> _log;
        private readonly IMapper _mapper;
        private readonly IBookingService _bookingService;

        public BookingsController(ILogger<BookingsController> log,
        IMapper mapper,
        IBookingService bookingService)
        {
            _log = log;
            _mapper = mapper;
            _bookingService = bookingService;
        }

        [HttpPost]
        public async Task<ActionResult<BookingDto>> CreateBooking([FromBody] BookingDto bookingDto)
        {
            _log.LogDebug($"REST request to save Booking : {bookingDto}");
            if (bookingDto.Id != 0 && bookingDto.Id != null)
                throw new BadRequestAlertException("A new booking cannot already have an ID", EntityName, "idexists");

            Booking booking = _mapper.Map<Booking>(bookingDto);
            //Should be the one made the request id
            booking.UserId = booking.User.Id; 
            await _bookingService.Save(booking);
            return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, booking.Id.ToString()));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(long? id, [FromBody] BookingDto bookingDto)
        {
            _log.LogDebug($"REST request to update Booking : {bookingDto}");
            if (bookingDto.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != bookingDto.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            Booking booking = _mapper.Map<Booking>(bookingDto);
            await _bookingService.Save(booking);
            return Ok(booking)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, booking.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetAllBookings(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of Bookings");
            var result = await _bookingService.FindAll(pageable);
            var page = new Page<BookingDto>(result.Content.Select(entity => _mapper.Map<BookingDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<BookingDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBooking([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to get Booking : {id}");
            var result = await _bookingService.FindOne(id);
            BookingDto bookingDto = _mapper.Map<BookingDto>(result);
            return ActionResultUtil.WrapOrNotFound(bookingDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to delete Booking : {id}");
            await _bookingService.Delete(id);
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
    }
}
