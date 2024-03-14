using System;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Services.Interfaces;
using PartyRentingPlatform.Domain.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace PartyRentingPlatform.Domain.Services;

public class NotificationService : INotificationService
{
    protected readonly INotificationRepository _notificationRepository;

    public NotificationService(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public virtual async Task<Notification> Save(Notification notification)
    {
        await _notificationRepository.CreateOrUpdateAsync(notification);
        await _notificationRepository.SaveChangesAsync();
        return notification;
    }

    public virtual async Task<IPage<Notification>> FindAll(IPageable pageable)
    {
        var page = await _notificationRepository.QueryHelper()
            .Include(notification => notification.User)
            .GetPageAsync(pageable);
        return page;
    }

    public virtual async Task<Notification> FindOne(long? id)
    {
        var result = await _notificationRepository.QueryHelper()
            .Include(notification => notification.User)
            .GetOneAsync(notification => notification.Id == id);
        return result;
    }

    public virtual async Task Delete(long? id)
    {
        await _notificationRepository.DeleteByIdAsync(id);
        await _notificationRepository.SaveChangesAsync();
    }

    public virtual async Task<IPage<Notification>> FindAllForUser(string userId, IPageable pageable)
    {
        return await _notificationRepository.QueryHelper()
            .Include(notification => notification.User)
            .Filter(notification => notification.UserId == userId)
            .GetPageAsync(pageable);
    }
}
