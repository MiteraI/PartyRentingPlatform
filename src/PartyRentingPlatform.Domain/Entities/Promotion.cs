using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace PartyRentingPlatform.Domain.Entities
{
    [Table("promotion")]
    public class Promotion : BaseEntity<long?>
    {
        [Required]
        public DateTime StartTime { get; set; }
        [Required]
        public DateTime EndTime { get; set; }
        [Required]
        public int? Discount { get; set; }
        public long? Minimum { get; set; }
        [JsonIgnore]
        public IList<Room> Rooms { get; set; } = new List<Room>();

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var promotion = obj as Promotion;
            if (promotion?.Id == null || promotion?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Equals(Id, promotion.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "Promotion{" +
                    $"ID='{Id}'" +
                    $", StartTime='{StartTime}'" +
                    $", EndTime='{EndTime}'" +
                    $", Discount='{Discount}'" +
                    $", Minimum='{Minimum}'" +
                    "}";
        }
    }
}
