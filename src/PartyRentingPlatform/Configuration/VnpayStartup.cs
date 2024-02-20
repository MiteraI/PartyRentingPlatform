// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PartyRentingPlatform.Domain.Services;
using PartyRentingPlatform.Domain.Services.Interfaces;

namespace PartyRentingPlatform.Configuration
{
    public static class VnpayStartup
    {
        public static IServiceCollection AddVnpayModule(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IVnpayService, VnpayService>();
            return services;
        }
    }
}
