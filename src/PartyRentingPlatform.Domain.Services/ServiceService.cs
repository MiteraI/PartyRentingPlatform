using System;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Services.Interfaces;
using PartyRentingPlatform.Domain.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace PartyRentingPlatform.Domain.Services;

public class ServiceService : IServiceService
{
    protected readonly IServiceRepository _serviceRepository;

    public ServiceService(IServiceRepository serviceRepository)
    {
        _serviceRepository = serviceRepository;
    }

    public virtual async Task<Service> Save(Service service)
    {
        await _serviceRepository.CreateOrUpdateAsync(service);
        await _serviceRepository.SaveChangesAsync();
        return service;
    }

    public virtual async Task<IPage<Service>> FindAll(IPageable pageable)
    {
        var page = await _serviceRepository.QueryHelper()
            .GetPageAsync(pageable);
        return page;
    }

    public virtual async Task<Service> FindOne(long? id)
    {
        var result = await _serviceRepository.QueryHelper()
            .GetOneAsync(service => service.Id == id);
        return result;
    }

    public virtual async Task Delete(long? id)
    {
        await _serviceRepository.DeleteByIdAsync(id);
        await _serviceRepository.SaveChangesAsync();
    }
}
