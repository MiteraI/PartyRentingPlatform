
using System;
using System.Threading;
using System.Collections.Generic;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;
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
using System.Security.Claims;
using PartyRentingPlatform.Dto.Service;

namespace PartyRentingPlatform.Controllers
{
    [Authorize]
    [Route("api/services")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private const string EntityName = "service";
        private readonly ILogger<ServicesController> _log;
        private readonly IMapper _mapper;
        private readonly IServiceService _serviceService;

        public ServicesController(ILogger<ServicesController> log,
        IMapper mapper,
        IServiceService serviceService)
        {
            _log = log;
            _mapper = mapper;
            _serviceService = serviceService;
        }

        [HttpPost]
        public async Task<ActionResult<ServiceDto>> CreateService([FromBody] ServiceDto serviceDto)
        {
            _log.LogDebug($"REST request to save Service : {serviceDto}");
            if (serviceDto.Id != 0 && serviceDto.Id != null)
                throw new BadRequestAlertException("A new service cannot already have an ID", EntityName, "idexists");

            Service service = _mapper.Map<Service>(serviceDto);
            await _serviceService.Save(service);
            return CreatedAtAction(nameof(GetService), new { id = service.Id }, service)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, service.Id.ToString()));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(long? id, [FromBody] ServiceDto serviceDto)
        {
            _log.LogDebug($"REST request to update Service : {serviceDto}");
            if (serviceDto.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != serviceDto.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            Service service = _mapper.Map<Service>(serviceDto);
            await _serviceService.Save(service);
            return Ok(service)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, service.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetAllServices(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of Services");
            var result = await _serviceService.FindAll(pageable);
            var page = new Page<ServiceDto>(result.Content.Select(entity => _mapper.Map<ServiceDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<ServiceDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetService([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to get Service : {id}");
            var result = await _serviceService.FindOne(id);
            ServiceDto serviceDto = _mapper.Map<ServiceDto>(result);
            return ActionResultUtil.WrapOrNotFound(serviceDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to delete Service : {id}");
            await _serviceService.Delete(id);
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }

        // -------------------------------------------------------
        // Host methods
        [Authorize(Roles = RolesConstants.HOST)]
        [HttpGet("host")]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetAllServicesForHost(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of Services for host");
            var userIdClaim = User.FindFirst(ClaimTypes.Name).Value;
            var result = await _serviceService.FindAllForHost(userIdClaim, pageable);
            var page = new Page<ServiceDto>(result.Content.Select(entity => _mapper.Map<ServiceDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<ServiceDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        // Create a service for host
        [Authorize(Roles = RolesConstants.HOST)]
        [HttpPost("host")]
        public async Task<ActionResult<ServiceDto>> CreateServiceForHost([FromBody] ServiceHostDto serviceDto)
        {
            _log.LogDebug($"REST request to save Service for host : {serviceDto}");
            if (serviceDto.Id != 0 && serviceDto.Id != null)
                throw new BadRequestAlertException("A new service cannot already have an ID", EntityName, "idexists");

            var userIdClaim = User.FindFirst(ClaimTypes.Name).Value;
            serviceDto.UserId = userIdClaim;
            Service service = _mapper.Map<Service>(serviceDto);
            Service newService = await _serviceService.Save(service);
            return CreatedAtAction(nameof(GetService), new { id = newService.Id }, newService)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, newService.Id.ToString()));
        }

        // Update a service for host
        [Authorize(Roles = RolesConstants.HOST)]
        [HttpPut("host/{id}")]
        public async Task<IActionResult> UpdateServiceForHost(long? id, [FromBody] ServiceHostDto serviceDto)
        {
            _log.LogDebug($"REST request to update Service for host : {serviceDto}");
            if (serviceDto.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != serviceDto.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");

            // Check if the service belongs to the host
            var userIdClaim = User.FindFirst(ClaimTypes.Name).Value;
            if (serviceDto.UserId != userIdClaim) return BadRequest("You are not authorized to update this service");

            Service service = _mapper.Map<Service>(serviceDto);
            await _serviceService.Save(service);

            return Ok(service)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, service.Id.ToString()));
        }

        // Delete a service for host
        [Authorize(Roles = RolesConstants.HOST)]
        [HttpDelete("host/{id}")]
        public async Task<IActionResult> DeleteServiceForHost([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to delete Service for host : {id}");
            var userIdClaim = User.FindFirst(ClaimTypes.Name).Value;

            // if the service does not belong to the host do not delete
            var service = await _serviceService.FindOne(id);
            if (service.UserId != userIdClaim) return BadRequest("You are not authorized to delete this service");
            await _serviceService.Delete(id);
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
    }
}
