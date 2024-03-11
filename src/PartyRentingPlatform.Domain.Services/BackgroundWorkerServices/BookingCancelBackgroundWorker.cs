// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PartyRentingPlatform.Domain.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Domain.Services.BackgroundWorkerServices
{
    public class BookingCancelBackgroundWorker : BackgroundService
    {
        readonly ILogger<BookingCancelBackgroundWorker> _logger;
        readonly IServiceProvider _serviceProvider;
        private const int ONE_HOUR = 3600000;

        public BookingCancelBackgroundWorker(ILogger<BookingCancelBackgroundWorker> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("BookingCancelBackgroundWorker executed");
            using (var scope = _serviceProvider.CreateScope())
            {
                IBookingService bookingService = scope.ServiceProvider.GetRequiredService<IBookingService>();
                await bookingService.CancelBookingWithoutAcceptedAfterOneDay();
            }
            await Task.Delay(ONE_HOUR, stoppingToken);
        }
    }
}
