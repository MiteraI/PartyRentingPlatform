using System.Threading.Tasks;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Services.Interfaces;
using Microsoft.Extensions.Options;
using FluentEmail.Smtp;
using PartyRentingPlatform.Infrastructure.Configuration;
using FluentEmail.Core;
using Microsoft.Extensions.Configuration;

namespace PartyRentingPlatform.Domain.Services;

public class MailService : IMailService
{
    private readonly SecuritySettings _securitySettings;
    private readonly IFluentEmail _fluentEmail;
    private readonly IConfiguration _configuration;

    public MailService(IOptions<SecuritySettings> securitySettings, IFluentEmail fluentEmail, IConfiguration configuration)
    {
        _securitySettings = securitySettings.Value;
        _fluentEmail = fluentEmail;
        _configuration = configuration;
    }

    public virtual async Task SendPasswordResetMail(User user)
    {
        //TODO send reset Email
    }

    public virtual async Task SendActivationEmail(User user)
    {
        var activationKey = user.ActivationKey;
        await _fluentEmail.To(user.Email)
            .Subject("Account Activation")
            .Body(_configuration.GetValue<string>("hostUrl") + "/api/activate?key=" + activationKey)
            .SendAsync();
    }

    public virtual Task SendCreationEmail(User user)
    {
        //TODO Creation Email
        return Task.FromResult(Task.CompletedTask);
    }
}
