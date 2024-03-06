// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using Newtonsoft.Json;
using PartyRentingPlatform.Crosscutting.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Dto.Profile
{
    public class ProfileDto
    {
        public string? Id { get; set; }
        public string? Login { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? ImageUrl { get; set; }
        public string? Email { get; set; }
        public double? Balance { get; set; }

        //Not sure what this is doing
        private string _langKey;
        [MinLength(2)]
        [MaxLength(6)]
        public string LangKey
        {
            get { return _langKey; }
            set { _langKey = value; if (string.IsNullOrEmpty(_langKey)) _langKey = Constants.DefaultLangKey; }
        }

        [JsonProperty(PropertyName = "authorities")]
        [JsonPropertyName("authorities")]
        public ISet<string>? Roles { get; set; }
    }
}
