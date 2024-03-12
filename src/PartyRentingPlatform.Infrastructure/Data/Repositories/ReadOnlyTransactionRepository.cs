// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using JHipsterNet.Core.Pagination;
using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Infrastructure.Data.Repositories
{
    public class ReadOnlyTransactionRepository : ReadOnlyGenericRepository<Transaction, long?>, IReadOnlyTransactionRepository
    {
        public ReadOnlyTransactionRepository(IUnitOfWork context) : base(context) { }
    }
}
