// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using Microsoft.Extensions.DependencyInjection;
using PartyRentingPlatform.Hubs;
using PartyRentingPlatform.Hubs.Interfaces;

namespace PartyRentingPlatform.Configuration
{
    public static class HubStartup
    {
        public static IServiceCollection AddHubModule(this IServiceCollection services)
        {
            services.AddSignalR();
            services.AddSingleton<INotificationHub, NotificationHub>();
            return services;
        }
    }
}
