using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using PartyRentingPlatform.Crosscutting.Enums;
using Newtonsoft.Json;

namespace PartyRentingPlatform.Dto
{

    public class RoomDto
    {
        public long? Id { get; set; }
        [Required]
        public string RoomName { get; set; }
        [Required]
        public string Address { get; set; }
        public string? Description { get; set; }
        [Required]
        public long Price { get; set; }
        [Required]
        public int RoomCapacity { get; set; }
        public int? Rating { get; set; }
        public RoomStatus Status { get; set; }
        public long? UserId { get; set; }
        public UserDto User { get; set; }
        public IList<PromotionDto> Promotions { get; set; } = new List<PromotionDto>();
        public IList<ServiceDto> Services { get; set; } = new List<ServiceDto>();

        // jhipster-needle-dto-add-field - JHipster will add fields here, do not remove
    }
}
