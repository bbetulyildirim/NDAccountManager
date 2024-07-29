using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NDAccountManager.Models;

namespace NDAccountManager.Models
{
    public class AccountShare
    {
        [Key]
        public int ShareId { get; set; }

        [Required]
        public int AccountId { get; set; }

        [ForeignKey("AccountId")]
        public Account Account { get; set; } 

        [Required]
        public int SharedBy { get; set; }

        [Required]
        public int SharedWith { get; set; }

        [Required]
        [StringLength(50)]
        public string ShareType { get; set; }

        public DateTime? ExpirationDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
