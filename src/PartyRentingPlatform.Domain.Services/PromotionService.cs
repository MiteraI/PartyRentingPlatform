using System;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Services.Interfaces;
using PartyRentingPlatform.Domain.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace PartyRentingPlatform.Domain.Services;

public class PromotionService : IPromotionService
{
    protected readonly IPromotionRepository _promotionRepository;

    public PromotionService(IPromotionRepository promotionRepository)
    {
        _promotionRepository = promotionRepository;
    }

    public virtual async Task<Promotion> Save(Promotion promotion)
    {
        await _promotionRepository.CreateOrUpdateAsync(promotion);
        await _promotionRepository.SaveChangesAsync();
        return promotion;
    }

    public virtual async Task<IPage<Promotion>> FindAll(IPageable pageable)
    {
        var page = await _promotionRepository.QueryHelper()
            .GetPageAsync(pageable);
        return page;
    }

    public virtual async Task<Promotion> FindOne(long? id)
    {
        var result = await _promotionRepository.QueryHelper()
            .GetOneAsync(promotion => promotion.Id == id);
        return result;
    }

    public virtual async Task Delete(long? id)
    {
        await _promotionRepository.DeleteByIdAsync(id);
        await _promotionRepository.SaveChangesAsync();
    }
}
