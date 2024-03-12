// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Infrastructure.Data.Repositories
{
    public class TransactionRepository : GenericRepository<Transaction, long?>, ITransactionRepository
    {
        public TransactionRepository(IUnitOfWork context) : base(context)
        {
        }
    }
}
