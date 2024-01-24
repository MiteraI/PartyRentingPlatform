using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PartyRentingPlatform.Crosscutting.Enums;

namespace PartyRentingPlatform.Domain.Entities
{
    [Table("notification")]
    public class Notification : BaseEntity<long?>
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime SentTime { get; set; }
        public NotificationType Enum { get; set; }
        [Required]
        public long? UserId { get; set; }
        public User User { get; set; }

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var notification = obj as Notification;
            if (notification?.Id == null || notification?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Equals(Id, notification.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "Notification{" +
                    $"ID='{Id}'" +
                    $", Title='{Title}'" +
                    $", Description='{Description}'" +
                    $", SentTime='{SentTime}'" +
                    $", Enum='{Enum}'" +
                    "}";
        }
    }
}
