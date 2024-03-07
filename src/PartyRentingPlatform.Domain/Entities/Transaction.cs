// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using PartyRentingPlatform.Crosscutting.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PartyRentingPlatform.Domain.Entities
{
    [Table("transaction")]
    public class Transaction : BaseEntity<long?>
    {
        public double Amount { get; set; }
        public TransactionStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? TransactionNo { get; set; } // For query Vnpay portal transaction
        public string UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var transaction = obj as Transaction;
            if (transaction?.Id == null || transaction?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Equals(Id, transaction.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "Notification{" +
                    $"ID='{Id}'" +
                    $", Status='{Status}'" +
                    $", Amount='{Amount}'" +
                    $", CreatedAt='{CreatedAt}'" +
                    "}";
        }
    }
}
