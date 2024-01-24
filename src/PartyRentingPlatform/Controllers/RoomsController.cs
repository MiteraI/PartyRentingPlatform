
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
    [Route("api/rooms")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private const string EntityName = "room";
        private readonly ILogger<RoomsController> _log;
        private readonly IMapper _mapper;
        private readonly IRoomService _roomService;

        public RoomsController(ILogger<RoomsController> log,
        IMapper mapper,
        IRoomService roomService)
        {
            _log = log;
            _mapper = mapper;
            _roomService = roomService;
        }

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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(long? id, [FromBody] RoomDto roomDto)
        {
            _log.LogDebug($"REST request to update Room : {roomDto}");
            if (roomDto.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != roomDto.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            Room room = _mapper.Map<Room>(roomDto);
            await _roomService.Save(room);
            return Ok(room)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, room.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomDto>>> GetAllRooms(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of Rooms");
            var result = await _roomService.FindAll(pageable);
            var page = new Page<RoomDto>(result.Content.Select(entity => _mapper.Map<RoomDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<RoomDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoom([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to get Room : {id}");
            var result = await _roomService.FindOne(id);
            RoomDto roomDto = _mapper.Map<RoomDto>(result);
            return ActionResultUtil.WrapOrNotFound(roomDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to delete Room : {id}");
            await _roomService.Delete(id);
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
    }
}
