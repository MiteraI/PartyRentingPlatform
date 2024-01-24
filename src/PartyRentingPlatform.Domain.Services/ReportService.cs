using System;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Services.Interfaces;
using PartyRentingPlatform.Domain.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace PartyRentingPlatform.Domain.Services;

public class ReportService : IReportService
{
    protected readonly IReportRepository _reportRepository;

    public ReportService(IReportRepository reportRepository)
    {
        _reportRepository = reportRepository;
    }

    public virtual async Task<Report> Save(Report report)
    {
        await _reportRepository.CreateOrUpdateAsync(report);
        await _reportRepository.SaveChangesAsync();
        return report;
    }

    public virtual async Task<IPage<Report>> FindAll(IPageable pageable)
    {
        var page = await _reportRepository.QueryHelper()
            .Include(report => report.Room)
            .Include(report => report.User)
            .GetPageAsync(pageable);
        return page;
    }

    public virtual async Task<Report> FindOne(long? id)
    {
        var result = await _reportRepository.QueryHelper()
            .Include(report => report.Room)
            .Include(report => report.User)
            .GetOneAsync(report => report.Id == id);
        return result;
    }

    public virtual async Task Delete(long? id)
    {
        await _reportRepository.DeleteByIdAsync(id);
        await _reportRepository.SaveChangesAsync();
    }
}
