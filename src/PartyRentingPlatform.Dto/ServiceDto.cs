using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace PartyRentingPlatform.Dto
{

    public class ServiceDto
    {
        public long? Id { get; set; }
        [Required]
        public string ServiceName { get; set; }
        public long? Price { get; set; }
        public string? Description { get; set; }

        // jhipster-needle-dto-add-field - JHipster will add fields here, do not remove
    }
}
