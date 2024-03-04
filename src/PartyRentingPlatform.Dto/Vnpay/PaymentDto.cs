// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Dto.Vnpay
{
    public class PaymentDto
    {
        public double Price { get; set; }
        public string ReturnUrl { get; set; }  
    }
}
