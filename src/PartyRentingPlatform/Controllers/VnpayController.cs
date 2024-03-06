// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PartyRentingPlatform.Crosscutting.Constants;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Services.Interfaces;
using PartyRentingPlatform.Dto.Vnpay;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Controllers
{
    [Route("api/vnpay")]
    [ApiController]
    public class VnpayController : ControllerBase
    {
        private readonly ILogger<VnpayController> _logger;
        private readonly IVnpayService _vnpayService;
        private readonly ITransactionService _transactionService;
        private readonly IWalletService _walletService;

        public VnpayController(ILogger<VnpayController> logger , IVnpayService vnpayService, ITransactionService transactionService, IWalletService walletService)
        {
            _logger = logger;
            _vnpayService = vnpayService;
            _transactionService = transactionService;
            _walletService = walletService;
        }

        [Authorize(Roles = RolesConstants.USER)]
        [HttpPost("payment")]
        public IActionResult GetPaymentUrl([FromBody] PaymentDto paymentDto)
        {
            return Ok(_vnpayService.CreateVnpayPortalUrl(paymentDto.Price, paymentDto.ReturnUrl, HttpContext));
        }

        [Authorize(Roles = RolesConstants.USER)]
        [HttpPost("payment-success")]
        public async Task<IActionResult> PaymentSuccess([FromBody] PaymentSuccessDto paymentSuccessDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.Name);
            Transaction transaction = new Transaction
            {
                Amount = paymentSuccessDto.Amount,
                Status = paymentSuccessDto.Status,
                CreatedAt = DateTime.Now,
                TransactionNo = paymentSuccessDto.TransactionNo,
                UserId = userIdClaim?.Value
            };

            await _transactionService.Save(transaction);

            await _walletService.IncreaseBalanceForUser(userIdClaim?.Value, paymentSuccessDto.Amount);

            return Ok("Payment success");
        }
    }
}
