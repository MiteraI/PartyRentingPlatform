// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Dto.Room
{
    public class RoomServiceHostDto
    {
        public long? Id { get; set; }
        public string ServiceName { get; set; }
        public long Price { get; set; }
        public string? Description { get; set; }
    }
}
