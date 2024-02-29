// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Dto.Room
{
    public class RoomPromoDto
    {
        public long? Id { get; set; }
        public string? Description { get; set; }
        public int Discount { get; set; }
        public long Minimum { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
