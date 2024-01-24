using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using PartyRentingPlatform.Crosscutting.Enums;

namespace PartyRentingPlatform.Dto
{

    public class NotificationDto
    {
        public long? Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime SentTime { get; set; }
        public NotificationType Enum { get; set; }
        public string? UserId { get; set; }
        public UserDto User { get; set; }

        // jhipster-needle-dto-add-field - JHipster will add fields here, do not remove
    }
}
