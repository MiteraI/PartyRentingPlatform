using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using JHipsterNet.Core.Pagination;
using JHipsterNet.Core.Pagination.Extensions;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Repositories.Interfaces;
using PartyRentingPlatform.Infrastructure.Data.Extensions;

namespace PartyRentingPlatform.Infrastructure.Data.Repositories
{
    public class PromotionRepository : GenericRepository<Promotion, long?>, IPromotionRepository
    {
        public PromotionRepository(IUnitOfWork context) : base(context)
        {
        }

        public override async Task<Promotion> CreateOrUpdateAsync(Promotion promotion)
        {
            List<Type> entitiesToBeUpdated = new List<Type>();
            return await base.CreateOrUpdateAsync(promotion, entitiesToBeUpdated);
        }
    }
}
