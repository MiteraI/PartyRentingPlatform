using System;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;

namespace PartyRentingPlatform.Domain.Services.Interfaces
{
    public interface IReportService
    {
        Task<Report> Save(Report report);

        Task<IPage<Report>> FindAll(IPageable pageable);

        Task<Report> FindOne(long? id);

        Task Delete(long? id);
    }
}
