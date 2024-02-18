// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace PartyRentingPlatform.Configuration
{
    public static class MailStartup
    {
        public static IServiceCollection AddMailModule(this IServiceCollection services, IConfiguration configuration) {

            //Use get Heroku's config vars like in DatabaseStartup.cs
            services.AddFluentEmail(configuration.GetValue<string>("MailSenderAddress"))
                .AddSmtpSender("smtp.gmail.com", 587
                , configuration.GetValue<string>("MailSenderAddress")
                , configuration.GetValue<string>("MailSenderPassword"));

            return services;
        }
    }
}
