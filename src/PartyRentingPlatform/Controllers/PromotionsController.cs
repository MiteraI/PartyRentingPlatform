
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
    [Route("api/promotions")]
    [ApiController]
    public class PromotionsController : ControllerBase
    {
        private const string EntityName = "promotion";
        private readonly ILogger<PromotionsController> _log;
        private readonly IMapper _mapper;
        private readonly IPromotionService _promotionService;

        public PromotionsController(ILogger<PromotionsController> log,
        IMapper mapper,
        IPromotionService promotionService)
        {
            _log = log;
            _mapper = mapper;
            _promotionService = promotionService;
        }

        [HttpPost]
        public async Task<ActionResult<PromotionDto>> CreatePromotion([FromBody] PromotionDto promotionDto)
        {
            _log.LogDebug($"REST request to save Promotion : {promotionDto}");
            if (promotionDto.Id != 0 && promotionDto.Id != null)
                throw new BadRequestAlertException("A new promotion cannot already have an ID", EntityName, "idexists");

            Promotion promotion = _mapper.Map<Promotion>(promotionDto);
            await _promotionService.Save(promotion);
            return CreatedAtAction(nameof(GetPromotion), new { id = promotion.Id }, promotion)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, promotion.Id.ToString()));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePromotion(long? id, [FromBody] PromotionDto promotionDto)
        {
            _log.LogDebug($"REST request to update Promotion : {promotionDto}");
            if (promotionDto.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != promotionDto.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            Promotion promotion = _mapper.Map<Promotion>(promotionDto);
            await _promotionService.Save(promotion);
            return Ok(promotion)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, promotion.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PromotionDto>>> GetAllPromotions(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of Promotions");
            var result = await _promotionService.FindAll(pageable);
            var page = new Page<PromotionDto>(result.Content.Select(entity => _mapper.Map<PromotionDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<PromotionDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPromotion([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to get Promotion : {id}");
            var result = await _promotionService.FindOne(id);
            PromotionDto promotionDto = _mapper.Map<PromotionDto>(result);
            return ActionResultUtil.WrapOrNotFound(promotionDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePromotion([FromRoute] long? id)
        {
            _log.LogDebug($"REST request to delete Promotion : {id}");
            await _promotionService.Delete(id);
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
    }
}
