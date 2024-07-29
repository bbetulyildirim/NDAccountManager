using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NDAccountManager.Models
{
    public class Account
    {
        [Key]
        public int AccountId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(255)]
        public string Platform { get; set; }

        [Required]
        [StringLength(255)]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        public string Notes { get; set; }

        public int? CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public Category Category { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
