// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Domain.Services.Interfaces
{
    public interface ITransactionService
    {
        Task<Transaction> Save(Transaction Transaction);

        Task<IPage<Transaction>> FindAll(IPageable pageable);

        Task<Transaction> FindOne(long? id);

        Task Delete(long? id);

        Task<IPage<Transaction>> FindAllByUserId(string? userId, IPageable pageable);
    }
}
