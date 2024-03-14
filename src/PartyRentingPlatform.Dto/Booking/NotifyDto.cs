// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using PartyRentingPlatform.Crosscutting.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Dto.Booking
{
    public class NotifyDto
    {
        public class NotificationDto
        {
            public long? Id { get; set; }
            public string? Title { get; set; }
            public string? Description { get; set; }
            public DateTime SentTime { get; set; }
            public NotificationType Enum { get; set; }
            public string? UserId { get; set; }
            public UserDto? User { get; set; }
        }
    }
}
