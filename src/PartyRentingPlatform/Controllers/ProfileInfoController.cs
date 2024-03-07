using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using PartyRentingPlatform.Dto.ProfileInfo;

namespace PartyRentingPlatform.Controllers;

[Route("management")]
[ApiController]
public class ProfileInfoController : ControllerBase
{

    private readonly ILogger<ProfileInfoController> _log;
    private readonly IHostEnvironment _environment;
    private readonly IConfiguration _configuration;

    public ProfileInfoController(ILogger<ProfileInfoController> log, IHostEnvironment environment, IConfiguration configuration)
    {
        _log = log;
        _environment = environment;
        _configuration = configuration;
    }

    [HttpGet("info")]
    public ActionResult<ProfileInfoDto> GetProfileInfos()
    {
        _log.LogDebug("REST request to get profile informations");
        return Ok(new ProfileInfoDto(GetDisplayRibbonOnProfiles(), GetVnpReturnUrl(), GetActiveProfile()));
    }

    private List<string> GetActiveProfile()
    {
        var activeProfiles = new List<string>
        {
            "api-docs"
        };

        if (_environment.IsDevelopment())
        {
            activeProfiles.Add("dev");
        }
        else if (_environment.IsProduction())
        {
            activeProfiles.Add("prod");
        }
        else if (_environment.IsStaging())
        {
            activeProfiles.Add("stag");
        }
        return activeProfiles;
    }

    private string GetDisplayRibbonOnProfiles()
    {
        return _configuration.GetSection("RibbonInfo")["display-ribbon-on-profiles"];
    }

    private string GetVnpReturnUrl()
    {
        return _configuration.GetValue<string>("vnp_ReturnUrl");
    }
}
