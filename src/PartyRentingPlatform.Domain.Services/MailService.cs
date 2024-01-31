using System.Threading.Tasks;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Services.Interfaces;
using Microsoft.Extensions.Options;
using FluentEmail.Smtp;
using PartyRentingPlatform.Infrastructure.Configuration;
using FluentEmail.Core;

namespace PartyRentingPlatform.Domain.Services;

public class MailService : IMailService
{
    private readonly SecuritySettings _securitySettings;
    private readonly IFluentEmail _fluentEmail;

    public MailService(IOptions<SecuritySettings> securitySettings, IFluentEmail fluentEmail)
    {
        _securitySettings = securitySettings.Value;
        _fluentEmail = fluentEmail;
    }

    public virtual async Task SendPasswordResetMail(User user)
    {
        //TODO send reset Email
    }

    public virtual async Task SendActivationEmail(User user)
    {
        var activationKey = user.ActivationKey;
        await _fluentEmail.To("kiet.hakh@gmail.com").Subject("Account Activation").Body("Testing web" + activationKey).SendAsync();

        //TODO Activation Email
    }

    public virtual Task SendCreationEmail(User user)
    {
        //TODO Creation Email
        return Task.FromResult(Task.CompletedTask);
    }
}
