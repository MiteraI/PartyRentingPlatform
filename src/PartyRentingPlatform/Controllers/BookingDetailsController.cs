
using System;
using System.Threading;
using System.Collections.Generic;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Crosscutting.Exceptions;
using PartyRentingPlatform.Web.Extensions;
using PartyRentingPlatform.Web.Rest.Utilities;
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
    [Route("api/booking-details")]
    [ApiController]
    public class BookingDetailsController : ControllerBase
    {
        private const string EntityName = "bookingDetails";
        private readonly ILogger<BookingDetailsController> _log;
        private readonly IBookingDetailsRepository _bookingDetailsRepository;

        public BookingDetailsController(ILogger<BookingDetailsController> log,
        IBookingDetailsRepository bookingDetailsRepository)
        {
            _log = log;
            _bookingDetailsRepository = bookingDetailsRepository;
        }

        [HttpPost]
        public async Task<ActionResult<BookingDetails>> CreateBookingDetails([FromBody] BookingDetails bookingDetails)
        {
            _log.LogDebug($"REST request to save BookingDetails : {bookingDetails}");
            if (bookingDetails.Id != 0 && bookingDetails.Id != null)
                throw new BadRequestAlertException("A new bookingDetails cannot already have an ID", EntityName, "idexists");

            await _bookingDetailsRepository.CreateOrUpdateAsync(bookingDetails);
            await _bookingDetailsRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBookingDetails), new { id = bookingDetails.Id }, bookingDetails)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, bookingDetails.Id.ToString()));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBookingDetails(long? id, [FromBody] BookingDetails bookingDetails)
        {
            _log.LogDebug($"REST request to update BookingDetails : {bookingDetails}");
            if (bookingDetails.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != bookingDetails.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            await _bookingDetailsRepository.CreateOrUpdateAsync(bookingDetails);
            await _bookingDetailsRepository.SaveChangesAsync();
            return Ok(bookingDetails)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, bookingDetails.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingDetails>>> GetAllBookingDetails(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of BookingDetails");
            var result = await _bookingDetailsRepository.QueryHelper()
                .Include(bookingDetails => bookingDetails.Service)
                .Include(bookingDetails => bookingDetails.Booking)
                .GetPageAsync(pageable);
            return Ok(result.Content).WithHeaders(result.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookingDetails([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to get BookingDetails : {id}");
            var result = await _bookingDetailsRepository.QueryHelper()
                .Include(bookingDetails => bookingDetails.Service)
                .Include(bookingDetails => bookingDetails.Booking)
                .GetOneAsync(bookingDetails => bookingDetails.Id == id);
            return ActionResultUtil.WrapOrNotFound(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookingDetails([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to delete BookingDetails : {id}");
            await _bookingDetailsRepository.DeleteByIdAsync(id);
            await _bookingDetailsRepository.SaveChangesAsync();
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
    }
}
