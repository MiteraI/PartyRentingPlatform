
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

namespace PartyRentingPlatform.Controllers
{
    [Authorize]
    [Route("api/reports")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private const string EntityName = "report";
        private readonly ILogger<ReportsController> _log;
        private readonly IMapper _mapper;
        private readonly IReportService _reportService;

        public ReportsController(ILogger<ReportsController> log,
        IMapper mapper,
        IReportService reportService)
        {
            _log = log;
            _mapper = mapper;
            _reportService = reportService;
        }

        [HttpPost]
        public async Task<ActionResult<ReportDto>> CreateReport([FromBody] ReportDto reportDto)
        {
            _log.LogDebug($"REST request to save Report : {reportDto}");
            if (reportDto.Id != 0 && reportDto.Id != null)
                throw new BadRequestAlertException("A new report cannot already have an ID", EntityName, "idexists");

            Report report = _mapper.Map<Report>(reportDto);
            await _reportService.Save(report);
            return CreatedAtAction(nameof(GetReport), new { id = report.Id }, report)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, report.Id.ToString()));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReport(long? id, [FromBody] ReportDto reportDto)
        {
            _log.LogDebug($"REST request to update Report : {reportDto}");
            if (reportDto.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != reportDto.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            Report report = _mapper.Map<Report>(reportDto);
            await _reportService.Save(report);
            return Ok(report)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, report.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReportDto>>> GetAllReports(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of Reports");
            var result = await _reportService.FindAll(pageable);
            var page = new Page<ReportDto>(result.Content.Select(entity => _mapper.Map<ReportDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<ReportDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetReport([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to get Report : {id}");
            var result = await _reportService.FindOne(id);
            ReportDto reportDto = _mapper.Map<ReportDto>(result);
            return ActionResultUtil.WrapOrNotFound(reportDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReport([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to delete Report : {id}");
            await _reportService.Delete(id);
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
    }
}
