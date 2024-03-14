using System;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;

namespace PartyRentingPlatform.Domain.Services.Interfaces
{
    public interface INotificationService
    {
        Task<Notification> Save(Notification notification);

        Task<IPage<Notification>> FindAll(IPageable pageable);

        Task<Notification> FindOne(long? id);

        Task Delete(long? id);

        Task<IPage<Notification>> FindAllForUser(string userId, IPageable pageable);
    }
}
