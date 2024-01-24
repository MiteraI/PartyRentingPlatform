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
    public class RoomRepository : GenericRepository<Room, long?>, IRoomRepository
    {
        public RoomRepository(IUnitOfWork context) : base(context)
        {
        }

        public override async Task<Room> CreateOrUpdateAsync(Room room)
        {
            List<Type> entitiesToBeUpdated = new List<Type>();

            await RemoveManyToManyRelationship<long?>("RoomsPromotions", "RoomsId", "PromotionsId", room.Id, room.Promotions.Select(x => x.Id).ToList());
            entitiesToBeUpdated.Add(typeof(Promotion));

            await RemoveManyToManyRelationship<long?>("RoomsServices", "RoomsId", "ServicesId", room.Id, room.Services.Select(x => x.Id).ToList());
            entitiesToBeUpdated.Add(typeof(Service));
            return await base.CreateOrUpdateAsync(room, entitiesToBeUpdated);
        }
    }
}
