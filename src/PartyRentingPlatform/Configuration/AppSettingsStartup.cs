using PartyRentingPlatform.Configuration;
using PartyRentingPlatform.Infrastructure.Configuration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace PartyRentingPlatform.Configuration;

public static class AppSettingsConfiguration
{
    public static IServiceCollection AddAppSettingsModule(this IServiceCollection services, IConfiguration configuration)
    {
        // Use this to load settings from appSettings file
        services.Configure<SecuritySettings>(options =>
        {
            configuration.GetSection("security").Bind(options);
            options.Authentication.Jwt.Base64Secret = configuration.GetValue<string>("JwtSecret");
        });

        return services;
    }
}
