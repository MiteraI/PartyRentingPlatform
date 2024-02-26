
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
using PartyRentingPlatform.Crosscutting.Constants;
using PartyRentingPlatform.Dto.Room;
using System.Security.Claims;

namespace PartyRentingPlatform.Controllers
{
    [Route("api/rooms")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private const string EntityName = "room";
        private readonly ILogger<RoomsController> _log;
        private readonly IMapper _mapper;
        private readonly IRoomService _roomService;
        private readonly IAzureBlobService _azureBlobService;

        public RoomsController(ILogger<RoomsController> log,
        IMapper mapper,
        IRoomService roomService,
        IAzureBlobService azureBlobService)
        {
            _log = log;
            _mapper = mapper;
            _roomService = roomService;
            _azureBlobService = azureBlobService;
        }

        [Authorize(Roles = RolesConstants.ADMIN)]
        [HttpPost]
        public async Task<ActionResult<RoomDto>> CreateRoom([FromBody] RoomDto roomDto)
        {
            _log.LogDebug($"REST request to save Room : {roomDto}");
            if (roomDto.Id != 0 && roomDto.Id != null)
                throw new BadRequestAlertException("A new room cannot already have an ID", EntityName, "idexists");

            Room room = _mapper.Map<Room>(roomDto);
            await _roomService.Save(room);
            return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, room)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, room.Id.ToString()));
        }

        [Authorize(Roles = RolesConstants.ADMIN)]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(long? id, [FromBody] RoomHostDto roomDto)
        {
            _log.LogDebug($"REST request to update Room : {roomDto}");
            if (roomDto.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != roomDto.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            Room room = _mapper.Map<Room>(roomDto);
            await _roomService.Save(room);
            return Ok(room)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, room.Id.ToString()));
        }

        [Authorize(Roles = RolesConstants.ADMIN)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomDto>>> GetAllRooms(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of Rooms");
            var result = await _roomService.FindAll(pageable);
            var page = new Page<RoomDto>(result.Content.Select(entity => _mapper.Map<RoomDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<RoomDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        [Authorize(Roles = RolesConstants.ADMIN)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoom([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to get Room : {id}");
            var result = await _roomService.FindOne(id);
            RoomDto roomDto = _mapper.Map<RoomDto>(result);
            return ActionResultUtil.WrapOrNotFound(roomDto);
        }

        [Authorize(Roles = RolesConstants.ADMIN)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to delete Room : {id}");
            await _roomService.Delete(id);
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }

        // -------------------------------------------------
        // Customer methods

        // Get all valid rooms with image URLs because customers should only see valid rooms
        [HttpGet("customer")]
        public async Task<ActionResult<IEnumerable<RoomHostDto>>> GetAllValidRoomsWithImageUrls(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of Rooms with image URLs");
            var result = await _roomService.FindAllValidWithImageUrls(pageable);
            var page = new Page<RoomHostDto>(result.Content.Select(entity => _mapper.Map<RoomHostDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<RoomHostDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        // Customer can see the details of a room
        [HttpGet("customer/details/{id}")]
        public async Task<IActionResult> GetRoomWithFullDetailsCustomer([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to get Room with full details : {id}");
            var result = await _roomService.FindOneWithFullDetails(id);
            RoomHostDto roomHostDto = _mapper.Map<RoomHostDto>(result);

            // If the user is not the host/ not authenticated and the room is not valid, they are not allowed to see the room
            if (roomHostDto.Status != RoomStatus.VALID)

                return BadRequest("You are not allowed to see this room");

            return ActionResultUtil.WrapOrNotFound(roomHostDto);
        }

        // -------------------------------------------------
        // Host methods
        [Authorize(Roles = RolesConstants.HOST)]
        [HttpGet("host")]
        public async Task<ActionResult<IEnumerable<RoomHostDto>>> GetAllRoomsByHostId(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of Rooms by host id");
            var userIdClaim = User.FindFirst(ClaimTypes.Name);
            var result = await _roomService.FindAllByHostId(userIdClaim.Value, pageable);
            var page = new Page<RoomHostDto>(result.Content.Select(entity => _mapper.Map<RoomHostDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<RoomHostDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        // Host can see the details of a room
        [Authorize(Roles = RolesConstants.HOST)]
        [HttpGet("host/details/{id}")]
        public async Task<IActionResult> GetRoomWithFullDetailsHost([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to get Room with full details : {id}");
            var result = await _roomService.FindOneWithFullDetails(id);
            RoomHostDto roomHostDto = _mapper.Map<RoomHostDto>(result);

            // If the user is not the host, they are not allowed to see the room
            var userIdClaim = User.FindFirst(ClaimTypes.Name);
            if (roomHostDto.UserId != userIdClaim.Value) return BadRequest("You are not allowed to see this room");

            return ActionResultUtil.WrapOrNotFound(roomHostDto);
        }

        [Authorize(Roles = RolesConstants.HOST)]
        [HttpPost("host")]
        public async Task<ActionResult<RoomHostDto>> CreateRoomHost([FromForm] RoomHostDto roomHostDto)
        {
            _log.LogDebug($"REST request to save Room : {roomHostDto}");
            if (roomHostDto.Id != 0 && roomHostDto.Id != null)
                throw new BadRequestAlertException("A new room cannot already have an ID", EntityName, "idexists");

            Room room = _mapper.Map<Room>(roomHostDto);

            // Assign user as host
            var userIdClaim = User.FindFirst(ClaimTypes.Name);
            room.UserId = userIdClaim.Value;

            room.Status = RoomStatus.VALID;

            // Use AzureBlobService to upload images and assign the URLs to the room
            var imageURLs = await _azureBlobService.UploadRoomImages(roomHostDto.FormFiles);
            room.ImageURLs = imageURLs.Select(url => new RoomImage { ImageUrl = url }).ToList();

            // It will automatically generate new services and promotions
            await _roomService.Save(room);
            return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, room)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, room.Id.ToString()));
        }

        // Update a room for host
        [Authorize(Roles = RolesConstants.HOST)]
        [HttpPut("host/{id}")]
        public async Task<IActionResult> UpdateRoomHost(long? id, [FromForm] RoomHostDto roomHostDto)
        {
            _log.LogDebug($"REST request to update Room for host : {roomHostDto}");
            if (roomHostDto.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != roomHostDto.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");

            Room room = _mapper.Map<Room>(roomHostDto);

            // Check if the user is the host of the room
            var userIdClaim = User.FindFirst(ClaimTypes.Name);
            if (room.UserId != userIdClaim.Value) return BadRequest("You are not allowed to update this room");

            // Not going to upload image becus image needs form-data

            await _roomService.Save(room);
            return Ok(room)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, room.Id.ToString()));
        }

        [Authorize(Roles = RolesConstants.HOST)]
        [HttpDelete("host/{id}")]
        public async Task<IActionResult> DeleteRoomHost([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to delete Room for host : {id}");
            var userIdClaim = User.FindFirst(ClaimTypes.Name);
            var result = await _roomService.FindOne(id);
            if (result.UserId != userIdClaim.Value) return BadRequest("You are not allowed to delete this room");

            await _roomService.Delete(id);
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
    }
}
