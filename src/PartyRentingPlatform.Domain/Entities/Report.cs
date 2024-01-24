using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PartyRentingPlatform.Domain.Entities
{
    [Table("report")]
    public class Report : BaseEntity<long?>
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime SentTime { get; set; }
        public long? RoomId { get; set; }
        public Room Room { get; set; }
        [Required]
        public long? UserId { get; set; }
        public User User { get; set; }

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var report = obj as Report;
            if (report?.Id == null || report?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Equals(Id, report.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "Report{" +
                    $"ID='{Id}'" +
                    $", Title='{Title}'" +
                    $", Description='{Description}'" +
                    $", SentTime='{SentTime}'" +
                    "}";
        }
    }
}
