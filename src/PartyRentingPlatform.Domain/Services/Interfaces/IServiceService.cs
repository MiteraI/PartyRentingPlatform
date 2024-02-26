using System;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;

namespace PartyRentingPlatform.Domain.Services.Interfaces
{
    public interface IServiceService
    {
        Task<Service> Save(Service service);

        Task<IPage<Service>> FindAll(IPageable pageable);

        Task<Service> FindOne(long? id);

        Task Delete(long? id);

        Task<IPage<Service>> FindAllForHost(string? userId, IPageable pageable);
    }
}
