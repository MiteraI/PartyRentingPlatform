// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Repositories.Interfaces;
using PartyRentingPlatform.Domain.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Domain.Services
{
    public class WalletService : IWalletService
    {
        private readonly IWalletRepository _walletRepository;
        public WalletService(IWalletRepository walletRepository)
        {
            _walletRepository = walletRepository;
        }

        public virtual async Task<Wallet> Save(Wallet wallet)
        {
            await _walletRepository.CreateOrUpdateAsync(wallet);
            await _walletRepository.SaveChangesAsync();
            return wallet;
        }

        public async Task DeductBalanceForUser(string? userId, double amount)
        {
            var wallet = await _walletRepository.QueryHelper().GetOneAsync(w => w.UserId == userId);
            wallet.Balance -= amount;
            await _walletRepository.CreateOrUpdateAsync(wallet);
            await _walletRepository.SaveChangesAsync();
        }

        public async Task IncreaseBalanceForUser(string? userId, double amount)
        {
            var wallet = await _walletRepository.QueryHelper().GetOneAsync(w => w.UserId == userId);
            wallet.Balance += amount;
            await _walletRepository.CreateOrUpdateAsync(wallet);
            await _walletRepository.SaveChangesAsync();
        }

        public virtual async Task<double> CurrentBalanceForUser(string userId)
        {
            var wallet = await _walletRepository.QueryHelper().GetOneAsync(w => w.UserId == userId);
            return wallet.Balance;
        }
    }
}
