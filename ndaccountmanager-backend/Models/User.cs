using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using NDAccountManager.Models;

namespace NDAccountManager.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [StringLength(255)]
        public string AzureAdId { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [Required]
        [StringLength(255)]
        public string Email { get; set; }

        [Required]
        [StringLength(50)]
        public string Role { get; set; }

        public ICollection<Account> Accounts { get; set; }
    }
}
