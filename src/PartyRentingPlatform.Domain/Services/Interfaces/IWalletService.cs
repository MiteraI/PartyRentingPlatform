// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using PartyRentingPlatform.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Domain.Services.Interfaces
{
    public interface IWalletService
    {
        Task<Wallet> Save(Wallet wallet);
        Task<double> CurrentBalanceForUser(string? userId);
        Task DeductBalanceForUser(string? userId, double amount);
        Task IncreaseBalanceForUser(string? userId, double amount);
    }
}
