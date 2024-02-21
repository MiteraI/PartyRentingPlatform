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
    public class BookingCustomerDto
    {
        public long? Id { get; set; }
        public string CustomerName { get; set; }
        public long? TotalPrice { get; set; }
        public DateTime? BookTime { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public long RoomId { get; set; }
        public RoomDto? Room { get; set; }
        public IList<BookingDetailCustomerDto> BookingDetails { get; set; } = new List<BookingDetailCustomerDto>();
    }
}
