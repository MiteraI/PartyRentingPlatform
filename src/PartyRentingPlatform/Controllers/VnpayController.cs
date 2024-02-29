// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PartyRentingPlatform.Domain.Services.Interfaces;

namespace PartyRentingPlatform.Controllers
{
    [Route("api/vnpay")]
    [ApiController]
    public class VnpayController : ControllerBase
    {
        private readonly ILogger<VnpayController> _logger;
        private readonly IVnpayService _vnpayService;

        public VnpayController(ILogger<VnpayController> logger ,IVnpayService vnpayService)
        {
            _logger = logger;
            _vnpayService = vnpayService;
        }

        [HttpGet("payment")]
        public IActionResult GetPaymentUrl(double price)
        {
            return Ok(_vnpayService.CreateVnpayPortalUrl(price, Request.Headers["Referer"], HttpContext));
        }
    }
}
