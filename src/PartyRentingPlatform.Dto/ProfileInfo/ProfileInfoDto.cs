using System.Collections.Generic;
using Newtonsoft.Json;

namespace PartyRentingPlatform.Dto.ProfileInfo;

public class ProfileInfoDto
{
    [JsonProperty("display-ribbon-on-profiles")]
    public string DisplayRibbonOnProfiles { get; set; }

    [JsonProperty("activeProfiles")]
    public List<string> ActiveProfiles { get; set; }

    [JsonProperty("vnp_ReturnUrl")]
    public string VnpReturnUrl { get; set; }

    public ProfileInfoDto(string displayRibbonOnProfiles, string vnpReturnUrl, List<string> activeProfiles)
    {
        DisplayRibbonOnProfiles = displayRibbonOnProfiles;
        ActiveProfiles = activeProfiles;
        VnpReturnUrl = vnpReturnUrl;
    }
}
