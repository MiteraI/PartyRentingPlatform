// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Dto.Booking
{
    public class BookingDetailCustomerDto
    {
        public long? Id { get; set; }
        public int ServiceQuantity { get; set; }
        public long ServiceId { get; set; }
        public ServiceDto? Service { get; set; }
    }
}
