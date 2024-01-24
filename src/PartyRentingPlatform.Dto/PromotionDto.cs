using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace PartyRentingPlatform.Dto
{

    public class PromotionDto
    {
        public long? Id { get; set; }
        [Required]
        public DateTime StartTime { get; set; }
        [Required]
        public DateTime EndTime { get; set; }
        [Required]
        public int Discount { get; set; }
        public long? Minimum { get; set; }

        // jhipster-needle-dto-add-field - JHipster will add fields here, do not remove
    }
}
