// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PartyRentingPlatform.Domain.Services;
using PartyRentingPlatform.Domain.Services.Interfaces;

namespace PartyRentingPlatform.Configuration
{
    public static class AzureBlobStartup
    {
        public static IServiceCollection AddAzureBlobModule(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IAzureBlobService, AzureBlobService>();
            return services;
        }
    }
}
