using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PartyRentingPlatform.Crosscutting.Enums;

namespace PartyRentingPlatform.Domain.Entities
{
    [Table("booking")]
    public class Booking : BaseEntity<long?>
    {
        public string? CustomerName { get; set; }
        [Required]
        public DateTime BookTime { get; set; }
        [Required]
        public DateTime StartTime { get; set; }
        [Required]
        public DateTime EndTime { get; set; }
        [Required]
        public long? TotalPrice { get; set; }
        public BookingStatus Status { get; set; }
        public int? Rating { get; set; }
        public string? Comment { get; set; }
        public long? RoomId { get; set; }
        public Room Room { get; set; }
        public IList<BookingDetails> BookingDetails { get; set; } = new List<BookingDetails>();
        [Required]
        public string? UserId { get; set; }
        public User User { get; set; }

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var booking = obj as Booking;
            if (booking?.Id == null || booking?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Equals(Id, booking.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "Booking{" +
                    $"ID='{Id}'" +
                    $", CustomerName='{CustomerName}'" +
                    $", BookTime='{BookTime}'" +
                    $", StartTime='{StartTime}'" +
                    $", EndTime='{EndTime}'" +
                    $", TotalPrice='{TotalPrice}'" +
                    $", Status='{Status}'" +
                    $", Rating='{Rating}'" +
                    $", Comment='{Comment}'" +
                    "}";
        }
    }
}
