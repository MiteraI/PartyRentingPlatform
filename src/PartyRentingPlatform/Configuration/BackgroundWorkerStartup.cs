// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PartyRentingPlatform.Domain.Services.BackgroundWorkerServices;

namespace PartyRentingPlatform.Configuration
{
    public static class BackgroundWorkerStartup
    {
        public static IServiceCollection AddBackgroundWorkerModule(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHostedService<BookingCancelBackgroundWorker>();
            return services;
        }
    }
}
