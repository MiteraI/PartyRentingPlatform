using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PartyRentingPlatform.Domain.Entities
{
    [Table("room_image")]
    public class RoomImage : BaseEntity<long?>
    {
        public string ImageUrl { get; set; }
        public long? RoomId { get; set; }
        public Room Room { get; set; }

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var roomImage = obj as RoomImage;
            if (roomImage?.Id == null || roomImage?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Equals(Id, roomImage.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "RoomImage{" +
                    $"ID='{Id}'" +
                    $", ImageUrl='{ImageUrl}'" +
                    "}";
        }
    }
}
