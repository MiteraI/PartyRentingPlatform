// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using System;
using System.Threading;
using System.Collections.Generic;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Web.Extensions;
using System.Linq;
using PartyRentingPlatform.Domain.Services.Interfaces;
using PartyRentingPlatform.Infrastructure.Web.Rest.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using PartyRentingPlatform.Crosscutting.Constants;
using AutoMapper;

namespace PartyRentingPlatform.Controllers
{
    [Route("api/transactions")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        protected readonly IMapper _mapper;
        protected readonly ITransactionService _transactionService;
        public TransactionController(IMapper mapper, ITransactionService transactionService)
        {
            _mapper = mapper;
            _transactionService = transactionService;
        }

        [Authorize(Roles = RolesConstants.USER)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetAllTransactionForUser(IPageable pageable)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.Name);
            var result = await _transactionService.FindAllByUserId(userIdClaim?.Value, pageable);
            var page = new Page<Transaction>(result.Content.ToList(), pageable, result.TotalElements);

            return Ok(((IPage<Transaction>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }
    }
}
