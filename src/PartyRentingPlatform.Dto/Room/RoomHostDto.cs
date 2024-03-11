// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using Microsoft.AspNetCore.Http;
using PartyRentingPlatform.Crosscutting.Enums;
using PartyRentingPlatform.Dto.Booking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Dto.Room
{
    public class RoomHostDto
    {
        public long? Id { get; set; }
        public string RoomName { get; set; }
        public string Address { get; set; }
        public string? Description { get; set; }
        public long Price { get; set; }
        public int RoomCapacity { get; set; }
        public double? Rating { get; set; }
        public string? UserId { get; set; }
        public UserAppDto? User { get; set; }
        public RoomStatus? Status { get; set; }
        public List<IFormFile>? FormFiles { get; set; }
        public List<RoomImageDto> ImageURLs { get; set; } = new List<RoomImageDto>();
        public List<RoomServiceHostDto> Services { get; set; } = new List<RoomServiceHostDto>();
        public List<RoomPromoDto> Promotions { get; set; } = new List<RoomPromoDto>();
        public List<BookingRatingDto> Ratings { get; set; } = new List<BookingRatingDto>();

    }
}
