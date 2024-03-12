// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using PartyRentingPlatform.Domain.Entities;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Hubs.Interfaces
{
    public interface INotificationHub
    {
        public Task SendNotificationToUser(string userId, Notification notification);
    }
}
