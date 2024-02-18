// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Domain.Entities
{
    [Table("wallet")]
    public class Wallet : BaseEntity<long?>
    {
        public double Balance { get; set; }
        public string UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var wallet = obj as Wallet;
            if (wallet?.Id == null || wallet?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Equals(Id, wallet.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "Notification{" +
                    $"ID='{Id}'" +
                    $", Balance='{Balance}'" +
                    "}";
        }
    }
}
