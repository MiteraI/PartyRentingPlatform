// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Domain.Services.Interfaces
{
    public interface IVnpayService
    {
        string CreateVnpayPortalUrl(double price, string returnUrl, HttpContext httpContext);
    }
}
