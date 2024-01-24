using System;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;

namespace PartyRentingPlatform.Domain.Services.Interfaces
{
    public interface IPromotionService
    {
        Task<Promotion> Save(Promotion promotion);

        Task<IPage<Promotion>> FindAll(IPageable pageable);

        Task<Promotion> FindOne(long? id);

        Task Delete(long? id);
    }
}
