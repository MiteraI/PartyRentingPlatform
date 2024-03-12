// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using PartyRentingPlatform.Crosscutting.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Dto.Vnpay
{
    public class PaymentSuccessDto
    {
        public double Amount { get; set; }
        public string TransactionNo { get; set; }
        public TransactionStatus Status { get; set; }
    }
}
