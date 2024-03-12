
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
using System.Security.Claims;
using PartyRentingPlatform.Dto.Booking;
using PartyRentingPlatform.Crosscutting.Constants;
using Microsoft.AspNetCore.SignalR;
using PartyRentingPlatform.Hubs;
using PartyRentingPlatform.Hubs.Interfaces;

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
        private readonly IRoomService _roomService;
        private readonly IWalletService _walletService;
        private readonly IServiceService _serviceService;
        private readonly INotificationHub _notificationHub;

        public BookingsController(ILogger<BookingsController> log,
        IMapper mapper,
        IBookingService bookingService,
        IRoomService roomService,
        IServiceService serviceService,
        IWalletService walletService,
        INotificationHub notificationHub)
        {
            _log = log;
            _mapper = mapper;
            _bookingService = bookingService;
            _roomService = roomService;
            _serviceService = serviceService;
            _walletService = walletService;
            _notificationHub = notificationHub;
        }

        // Admin related/ Jhipster generated code
        [HttpPost]
        public async Task<ActionResult<BookingDto>> CreateBooking([FromBody] BookingDto bookingDto)
        {
            _log.LogDebug($"REST request to save Booking : {bookingDto}");
            if (bookingDto.Id != 0 && bookingDto.Id != null)
                throw new BadRequestAlertException("A new booking cannot already have an ID", EntityName, "idexists");

            Booking booking = _mapper.Map<Booking>(bookingDto);

            //Getting userId from token and adding it to booking, must use ClaimTypes.Name
            //Noted in TokenProvider.cs
            var userIdClaim = User.FindFirst(ClaimTypes.Name);

            booking.UserId = userIdClaim.Value;
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

        // -----------------------------------------------------------------------------------------------
        // Customer related/ Custom code
        [Authorize(Roles = RolesConstants.USER)]
        [HttpGet("customer")]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetAllCustomerBookings(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of Customer Bookings");
            var userIdClaim = User.FindFirst(ClaimTypes.Name);
            var result = await _bookingService.FindAllForCustomer(userIdClaim.Value, pageable);
            var page = new Page<BookingDto>(result.Content.Select(entity => _mapper.Map<BookingDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<BookingDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        // Get details of a booking of customer
        [Authorize(Roles = RolesConstants.USER)]
        [HttpGet("customer/{id}")]
        public async Task<IActionResult> GetCustomerBooking(long? id)
        {
            _log.LogDebug($"REST request to get Customer Booking : {id}");
            var userIdClaim = User.FindFirst(ClaimTypes.Name);
            var result = await _bookingService.FindOneForCustomer(id);
            if (result == null) return BadRequest("Booking not found");
            if (result.UserId != userIdClaim.Value) return BadRequest("Booking does not belong to user");
            //Has booking details with service inside
            BookingCustomerDto bookingDto = _mapper.Map<BookingCustomerDto>(result);
            return ActionResultUtil.WrapOrNotFound(bookingDto);
        }

        [Authorize(Roles = RolesConstants.USER)]
        [HttpPost("customer")]
        public async Task<ActionResult<BookingDto>> CreateCustomerBooking([FromBody] BookingCustomerDto bookingDto)
        {
            _log.LogDebug($"REST request to save Booking : {bookingDto}");
            if (bookingDto.Id != 0 && bookingDto.Id != null)
                throw new BadRequestAlertException("A new booking cannot already have an ID", EntityName, "idexists");

            Booking booking = _mapper.Map<Booking>(bookingDto);

            //If there is no booking details
            if (booking.BookingDetails.Count == 0) return BadRequest("Booking must have at least 1 service");

            //Check if StartTime is before EndTime
            if (booking.StartTime > booking.EndTime) return BadRequest("Start time must be before end time");

            //Check if StartTime is 3 days in advance
             if (booking.StartTime < DateTime.Now.AddDays(3)) return BadRequest("Start time must be at least 3 days in advance");

            //If start time is before 8am or after 11pm
            if (booking.StartTime.Hour < 8 || booking.StartTime.Hour > 23) return BadRequest("Booking time must be between 8am and 11pm");

            //If booking time is more than 6 hours
            if ((booking.EndTime - booking.StartTime).TotalHours > 6) return BadRequest("Booking time must be less or equal to 6 hours");

            //Getting userId from token and adding it to booking, must use ClaimTypes.Name
            //Noted in TokenProvider.cs
            var userIdClaim = User.FindFirst(ClaimTypes.Name);

            booking.UserId = userIdClaim.Value;

            booking.BookTime = DateTime.Now;

            booking.Status = BookingStatus.APPROVING;

            //Get room from room id to do TotalPrice = RoomPrice * booking time in hours + ServicePrice
            Room bookedRoom = await _roomService.FindOne(booking.RoomId);
            if (bookedRoom == null) return BadRequest("Room not found");
            if (bookedRoom.Status != RoomStatus.VALID) return BadRequest("Room is not available");
            if (bookedRoom.UserId.ToLower().Equals(userIdClaim.Value.ToLower())) return BadRequest("You cannot book your own room");

            //Calculate service price
            long servicePrice = 0;
            foreach (var bookingDetail in booking.BookingDetails)
            {
                Service service = await _serviceService.FindOne(bookingDetail.ServiceId);
                if (service == null) return BadRequest("Service not found");
                servicePrice += service.Price * bookingDetail.ServiceQuantity;
            }

            //Check if this booking overlapped time and room with another booking
            if (await _bookingService.CheckOverlappedBooking(booking.StartTime, booking.EndTime, bookedRoom.Id.Value))
                return BadRequest("This booking overlapped time with another booking. Please choose another time");

            //Calculate total price
            booking.TotalPrice = (long)(bookedRoom.Price * (booking.EndTime - booking.StartTime).TotalHours) + servicePrice;

            // Check if balance is enough
            if (await _walletService.CurrentBalanceForUser(userIdClaim.Value) < (double)booking.TotalPrice)
                return BadRequest("Your is balance is not enough");

            //It will automatically generate new booking details to database
            await _bookingService.Save(booking);
            return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, booking.Id.ToString()));
        }

        [Authorize(Roles = RolesConstants.USER)]
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelBooking([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to cancel Booking : {id}");
            var booking = await _bookingService.FindOne(id);

            if (booking == null) return BadRequest("Booking not found");

            //Check if there is CustomerName
            if (string.IsNullOrEmpty(booking.CustomerName)) return BadRequest("Booking does not have customer name");

            //Check if booking belong to user
            var userIdClaim = User.FindFirst(ClaimTypes.Name);
            if (booking.UserId != userIdClaim.Value) return BadRequest("Booking does not belong to user");

            //If user cancel booking before 60 hours until start time and booking status is accepted, refund 50% of total price (because user paid 50% deposit)
            //If user cancel booking under 60 hours until start time and booking status is accepted, refund 15% of total price (because user paid 50% deposit)
            //If user cancel booking under 12 hours until start time and booking status is accepted, no refund
            //If user cancel and booking status is approving then just change status to cancel
            //TODO: Send notification to room owner
            if (booking.StartTime > DateTime.Now.AddHours(60) && booking.Status == BookingStatus.ACCEPTED)
            {
                booking.Status = BookingStatus.CANCEL;
                await _bookingService.Save(booking);
                await _walletService.IncreaseBalanceForUser(booking.UserId, Math.Ceiling((double)booking.TotalPrice * 0.5 / 1000) * 1000);
                await _walletService.DeductBalanceForUser(booking.Room.UserId, Math.Ceiling((double)booking.TotalPrice * 0.5 / 1000) * 1000);
                return Ok(booking)
                    .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, booking.Id.ToString()));
            }
            else if (booking.StartTime < DateTime.Now.AddHours(60) && booking.Status == BookingStatus.ACCEPTED)
            {
                booking.Status = BookingStatus.CANCEL;
                await _bookingService.Save(booking);
                await _walletService.IncreaseBalanceForUser(booking.UserId, Math.Ceiling((double)booking.TotalPrice * 0.15 / 1000) * 1000);
                await _walletService.DeductBalanceForUser(booking.Room.UserId, Math.Ceiling((double)booking.TotalPrice * 0.15 / 1000) * 1000);
                return Ok(booking)
                    .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, booking.Id.ToString()));
            }
            else if (booking.StartTime < DateTime.Now.AddHours(12) && booking.Status == BookingStatus.ACCEPTED)
            {
                booking.Status = BookingStatus.CANCEL;
                await _bookingService.Save(booking);
                return Ok(booking)
                    .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, booking.Id.ToString()));
            }
            else if (booking.Status == BookingStatus.APPROVING)
            {
                booking.Status = BookingStatus.CANCEL;
                await _bookingService.Save(booking);
                return Ok(booking)
                    .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, booking.Id.ToString()));
            }
            else
            {
                return BadRequest("Cannot cancel booking");
            }
        }

        [Authorize(Roles = RolesConstants.USER)]
        [HttpPut("{id}/confirm")]
        public async Task<IActionResult> ConfirmBookingPayment([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to confirm Booking : {id}");
            var booking = await _bookingService.FindOne(id);

            if (booking == null) return BadRequest("Booking not found");

            //Check if booking belong to user
            var userIdClaim = User.FindFirst(ClaimTypes.Name);
            if (booking.UserId != userIdClaim.Value) return BadRequest("Booking does not belong to user");

            if (booking.Status != BookingStatus.ACCEPTED) return BadRequest("Booking cannot be confirmed");
            booking.Status = BookingStatus.SUCCESS;
            await _bookingService.Save(booking);

            // Pays rest of money to room's owner
            //Deduct balance from booking's user and increase balance for room's user
            //Deposit money equals half total price and round it to 1000s
            await _walletService.IncreaseBalanceForUser(booking.Room.UserId, Math.Ceiling((double)booking.TotalPrice * 0.4 / 1000) * 1000);
            await _walletService.DeductBalanceForUser(booking.UserId, Math.Ceiling((double)booking.TotalPrice / 2 / 1000) * 1000);

            return Ok(booking)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, booking.Id.ToString()));
        }

        [Authorize(Roles = RolesConstants.USER)]
        [HttpPut("{id}/rate")]
        public async Task<IActionResult> RateBooking([FromRoute] long? id, [FromBody] BookingRatingDto bookingRatingDto)
        {
            _log.LogDebug($"REST request to rate Booking : {id}");
            var booking = await _bookingService.FindOne(id);

            if (booking == null) return BadRequest("Booking not found");

            //Check if booking belong to user
            var userIdClaim = User.FindFirst(ClaimTypes.Name);
            if (booking.UserId != userIdClaim.Value) return BadRequest("Booking does not belong to user");

            if (booking.Status != BookingStatus.SUCCESS) return BadRequest("Booking cannot be rated");

            booking.Rating = bookingRatingDto.Rating;
            booking.Comment = bookingRatingDto.Comment;
            await _bookingService.Save(booking);
            await _roomService.UpdateRating(booking.RoomId, bookingRatingDto.Rating);
            return Ok(booking)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, booking.Id.ToString()));
        }

        // -----------------------------------------------------------------------------------------------
        // Host related/ Custom code
        // Get all bookings that belong to a host from combining all of the host's rooms's bookings
        [Authorize(Roles = RolesConstants.HOST)]
        [HttpGet("host")]
        public async Task<ActionResult<IEnumerable<BookingCustomerDto>>> GetAllHostBookings(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of Host Bookings");
            var userIdClaim = User.FindFirst(ClaimTypes.Name);
            var result = await _bookingService.FindAllForHost(userIdClaim.Value, pageable);
            var page = new Page<BookingCustomerDto>(result.Content.Select(entity => _mapper.Map<BookingCustomerDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<BookingCustomerDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        [Authorize(Roles = RolesConstants.HOST)]
        [HttpGet("host/details/{id}")]
        public async Task<IActionResult> GetHostBooking([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to get Host Booking : {id}");
            var userIdClaim = User.FindFirst(ClaimTypes.Name);
            var result = await _bookingService.FindOneForHost(id);
            if (result == null) return BadRequest("Booking not found");
            if (result.Room.UserId != userIdClaim.Value) return BadRequest("Booking's room does not belong to user");
            BookingCustomerDto bookingDto = _mapper.Map<BookingCustomerDto>(result);
            return ActionResultUtil.WrapOrNotFound(bookingDto);
        }

        [Authorize(Roles = RolesConstants.HOST)]
        [HttpGet("host/{status}")]
        public async Task<ActionResult<IEnumerable<BookingCustomerDto>>> GetAllHostBookingsByStatus([FromRoute] BookingStatus status, IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of Host Bookings by status");
            var userIdClaim = User.FindFirst(ClaimTypes.Name);
            var result = await _bookingService.FindAllForHostByStatus(userIdClaim.Value, status, pageable);
            var page = new Page<BookingCustomerDto>(result.Content.Select(entity => _mapper.Map<BookingCustomerDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<BookingCustomerDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        [Authorize(Roles = RolesConstants.HOST)]
        [HttpPut("{id}/accept")]
        public async Task<IActionResult> AcceptBooking([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to accept Booking : {id}");
            var booking = await _bookingService.FindOne(id);

            if (booking == null) return BadRequest("Booking not found");

            // Check if booking has room belong to user
            var userIdClaim = User.FindFirst(ClaimTypes.Name);
            Room room = await _roomService.FindOne(booking.RoomId);
            if (room.UserId != userIdClaim.Value) return BadRequest("Room does not belong to user");

            if (booking.Status != BookingStatus.APPROVING) return BadRequest("Booking cannot be accepted");

            booking.Status = BookingStatus.ACCEPTED;
            await _bookingService.Save(booking);

            //Pays deposit to room's owner
            //Deduct balance from booking's user and increase balance for room's user
            //Deposit money equals half total price and round it to 1000s
            await _walletService.IncreaseBalanceForUser(booking.Room.UserId, Math.Ceiling((double)booking.TotalPrice / 2 / 1000) * 1000);
            await _walletService.DeductBalanceForUser(booking.UserId, Math.Ceiling((double)booking.TotalPrice / 2 / 1000) * 1000);

            return Ok(booking)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, booking.Id.ToString()));
        }

        [Authorize(Roles = RolesConstants.HOST)]
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectBooking([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to reject Booking : {id}");
            var booking = await _bookingService.FindOne(id);

            if (booking == null) return BadRequest("Booking not found");

            // Check if booking has room belong to user
            var userIdClaim = User.FindFirst(ClaimTypes.Name);
            Room room = await _roomService.FindOne(booking.RoomId);
            if (room.UserId != userIdClaim.Value) return BadRequest("Room does not belong to user");

            if (booking.Status != BookingStatus.APPROVING) return BadRequest("Booking cannot be rejected");
            booking.Status = BookingStatus.REJECTED;
            await _bookingService.Save(booking);

            await _notificationHub.SendNotificationToUser(booking.UserId
                , new Notification
                {
                    Title = "Booking rejected",
                    Description = "Your booking has been rejected",
                    SentTime = DateTime.Now,
                    Enum = NotificationType.REJECTED
                });

            return Ok(booking)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, booking.Id.ToString()));
        }
    }
}
