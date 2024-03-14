
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
using PartyRentingPlatform.Dto.Booking;
using System.Security.Claims;
using PartyRentingPlatform.Crosscutting.Constants;

namespace PartyRentingPlatform.Controllers
{
    [Authorize]
    [Route("api/notifications")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private const string EntityName = "notification";
        private readonly ILogger<NotificationsController> _log;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;

        public NotificationsController(ILogger<NotificationsController> log,
        IMapper mapper,
        INotificationService notificationService)
        {
            _log = log;
            _mapper = mapper;
            _notificationService = notificationService;
        }

        [Authorize(Roles = RolesConstants.ADMIN)]
        [HttpPost]
        public async Task<ActionResult<NotificationDto>> CreateNotification([FromBody] NotificationDto notificationDto)
        {
            _log.LogDebug($"REST request to save Notification : {notificationDto}");
            if (notificationDto.Id != 0 && notificationDto.Id != null)
                throw new BadRequestAlertException("A new notification cannot already have an ID", EntityName, "idexists");

            Notification notification = _mapper.Map<Notification>(notificationDto);
            await _notificationService.Save(notification);
            return CreatedAtAction(nameof(GetNotification), new { id = notification.Id }, notification)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, notification.Id.ToString()));
        }

        [Authorize(Roles = RolesConstants.ADMIN)]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNotification(long? id, [FromBody] NotificationDto notificationDto)
        {
            _log.LogDebug($"REST request to update Notification : {notificationDto}");
            if (notificationDto.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != notificationDto.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            Notification notification = _mapper.Map<Notification>(notificationDto);
            await _notificationService.Save(notification);
            return Ok(notification)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, notification.Id.ToString()));
        }

        [Authorize(Roles = RolesConstants.ADMIN)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationDto>>> GetAllNotifications(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of Notifications");
            var result = await _notificationService.FindAll(pageable);
            var page = new Page<NotificationDto>(result.Content.Select(entity => _mapper.Map<NotificationDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<NotificationDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        [Authorize(Roles = RolesConstants.ADMIN)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNotification([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to get Notification : {id}");
            var result = await _notificationService.FindOne(id);
            NotificationDto notificationDto = _mapper.Map<NotificationDto>(result);
            return ActionResultUtil.WrapOrNotFound(notificationDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to delete Notification : {id}");
            await _notificationService.Delete(id);
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }

        [Authorize(Roles = RolesConstants.USER)]
        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<NotifyDto>>> GetAllNotificationsForUser(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of Notifications for the current user");
            var result = await _notificationService.FindAllForUser(User.FindFirst(ClaimTypes.Name).Value, pageable);
            var page = new Page<NotifyDto>(result.Content.Select(entity => _mapper.Map<NotifyDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<NotifyDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }
    }
}
