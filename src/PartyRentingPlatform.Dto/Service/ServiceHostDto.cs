// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Dto.Service
{
    public class ServiceHostDto
    {
        public long? Id { get; set; }
        public string ServiceName { get; set; }
        public string? UserId { get; set; }
        public long? Price { get; set; }
        public string? Description { get; set; }
    }
}
