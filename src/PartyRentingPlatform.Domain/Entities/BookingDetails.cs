using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PartyRentingPlatform.Domain.Entities
{
    [Table("booking_details")]
    public class BookingDetails : BaseEntity<long?>
    {
        public int ServiceQuantity { get; set; }
        public long? ServiceId { get; set; }
        public Service Service { get; set; }
        public long? BookingId { get; set; }
        public Booking Booking { get; set; }

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var bookingDetails = obj as BookingDetails;
            if (bookingDetails?.Id == null || bookingDetails?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Equals(Id, bookingDetails.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "BookingDetails{" +
                    $"ID='{Id}'" +
                    $", ServiceQuantity='{ServiceQuantity}'" +
                    "}";
        }
    }
}
