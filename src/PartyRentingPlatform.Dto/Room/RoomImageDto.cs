// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Dto.Room
{
    public class RoomImageDto
    {
        public long? Id { get; set; }
        public string ImageUrl { get; set; }
        public long? RoomId { get; set; }
    }
}
