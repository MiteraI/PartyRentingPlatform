using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PartyRentingPlatform.Crosscutting.Enums;
using Newtonsoft.Json;

namespace PartyRentingPlatform.Domain.Entities
{
    [Table("room")]
    public class Room : BaseEntity<long?>
    {
        [Required]
        public string? RoomName { get; set; }
        [Required]
        public string? Address { get; set; }
        public string? Description { get; set; }
        [Required]
        public long? Price { get; set; }
        [Required]
        public int? RoomCapacity { get; set; }
        public int? Rating { get; set; }
        public RoomStatus Status { get; set; }
        public IList<RoomImage> ImageURLs { get; set; } = new List<RoomImage>();
        [Required]
        public string? UserId { get; set; }
        public User User { get; set; }
        public IList<Promotion> Promotions { get; set; } = new List<Promotion>();
        public IList<Service> Services { get; set; } = new List<Service>();

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var room = obj as Room;
            if (room?.Id == null || room?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Equals(Id, room.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "Room{" +
                    $"ID='{Id}'" +
                    $", RoomName='{RoomName}'" +
                    $", Address='{Address}'" +
                    $", Description='{Description}'" +
                    $", Price='{Price}'" +
                    $", RoomCapacity='{RoomCapacity}'" +
                    $", Rating='{Rating}'" +
                    $", Status='{Status}'" +
                    "}";
        }
    }
}
