using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace PartyRentingPlatform.Domain.Entities
{
    [Table("service")]
    public class Service : BaseEntity<long?>
    {
        [Required]
        public string? ServiceName { get; set; }
        public long Price { get; set; }
        public string? Description { get; set; }
        public User User { get; set; }
        public string UserId { get; set; }
        [JsonIgnore]
        public IList<Room> Rooms { get; set; } = new List<Room>();

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var service = obj as Service;
            if (service?.Id == null || service?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Equals(Id, service.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "Service{" +
                    $"ID='{Id}'" +
                    $", ServiceName='{ServiceName}'" +
                    $", Price='{Price}'" +
                    $", Description='{Description}'" +
                    "}";
        }
    }
}
