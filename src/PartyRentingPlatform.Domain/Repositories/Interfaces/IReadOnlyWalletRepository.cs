// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using PartyRentingPlatform.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Domain.Repositories.Interfaces
{
    public interface IReadOnlyWalletRepository : IReadOnlyGenericRepository<Wallet, long?>
    {
    }
}
