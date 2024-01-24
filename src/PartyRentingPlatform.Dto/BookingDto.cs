using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using PartyRentingPlatform.Crosscutting.Enums;

namespace PartyRentingPlatform.Dto
{

    public class BookingDto
    {
        public long? Id { get; set; }
        public string? CustomerName { get; set; }
        [Required]
        public DateTime BookTime { get; set; }
        [Required]
        public DateTime StartTime { get; set; }
        [Required]
        public DateTime EndTime { get; set; }
        [Required]
        public long TotalPrice { get; set; }
        public BookingStatus Status { get; set; }
        public int? Rating { get; set; }
        public string? Comment { get; set; }
        public long? RoomId { get; set; }
        public RoomDto Room { get; set; }
        public string? UserId { get; set; }
        public UserDto User { get; set; }

        // jhipster-needle-dto-add-field - JHipster will add fields here, do not remove
    }
}
