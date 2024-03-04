// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using JHipsterNet.Core.Pagination;
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
    public class TransactionService : ITransactionService
    {
        protected readonly ITransactionRepository _transactionRepository;
        public TransactionService(ITransactionRepository transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        public virtual async Task<Transaction> Save(Transaction transaction)
        {
            await _transactionRepository.CreateOrUpdateAsync(transaction);
            await _transactionRepository.SaveChangesAsync();
            return transaction;
        }
        public virtual async Task<Transaction> FindOne(long? id)
        {
            return await _transactionRepository.QueryHelper()
                .GetOneAsync(transaction => transaction.Id == id);
        }
        public virtual async Task<IPage<Transaction>> FindAll(IPageable pageable)
        {
            return await _transactionRepository.QueryHelper()
                .GetPageAsync(pageable);
        }
        public virtual async Task Delete(long? id)
        {
            await _transactionRepository.DeleteByIdAsync(id);
            await _transactionRepository.SaveChangesAsync();
        }

        public virtual async Task<IPage<Transaction>> FindAllByUserId(string? userId, IPageable pageable)
        {
            var page = await _transactionRepository.QueryHelper()
                .Filter(transaction => transaction.UserId == userId)
                .GetPageAsync(pageable);
            return page;
        }
    }
}
