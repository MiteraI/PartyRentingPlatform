
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
    [Route("api/room-images")]
    [ApiController]
    public class RoomImagesController : ControllerBase
    {
        private const string EntityName = "roomImage";
        private readonly ILogger<RoomImagesController> _log;
        private readonly IRoomImageRepository _roomImageRepository;

        public RoomImagesController(ILogger<RoomImagesController> log,
        IRoomImageRepository roomImageRepository)
        {
            _log = log;
            _roomImageRepository = roomImageRepository;
        }

        [HttpPost]
        public async Task<ActionResult<RoomImage>> CreateRoomImage([FromBody] RoomImage roomImage)
        {
            _log.LogDebug($"REST request to save RoomImage : {roomImage}");
            if (roomImage.Id != 0 && roomImage.Id != null)
                throw new BadRequestAlertException("A new roomImage cannot already have an ID", EntityName, "idexists");

            await _roomImageRepository.CreateOrUpdateAsync(roomImage);
            await _roomImageRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRoomImage), new { id = roomImage.Id }, roomImage)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, roomImage.Id.ToString()));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoomImage(long? id, [FromBody] RoomImage roomImage)
        {
            _log.LogDebug($"REST request to update RoomImage : {roomImage}");
            if (roomImage.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != roomImage.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            await _roomImageRepository.CreateOrUpdateAsync(roomImage);
            await _roomImageRepository.SaveChangesAsync();
            return Ok(roomImage)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, roomImage.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomImage>>> GetAllRoomImages(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of RoomImages");
            var result = await _roomImageRepository.QueryHelper()
                .Include(roomImage => roomImage.Room)
                .GetPageAsync(pageable);
            return Ok(result.Content).WithHeaders(result.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoomImage([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to get RoomImage : {id}");
            var result = await _roomImageRepository.QueryHelper()
                .Include(roomImage => roomImage.Room)
                .GetOneAsync(roomImage => roomImage.Id == id);
            return ActionResultUtil.WrapOrNotFound(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoomImage([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to delete RoomImage : {id}");
            await _roomImageRepository.DeleteByIdAsync(id);
            await _roomImageRepository.SaveChangesAsync();
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
    }
}
