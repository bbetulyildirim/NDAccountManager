using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NDAccountManager.Data;
using NDAccountManager.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NDAccountManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AccountsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAccountsByUserId/{userId}")]
        public async Task<ActionResult<IEnumerable<Account>>> GetAccountsByUserId(int userId)
        {
            var accounts = await _context.Accounts.Where(a => a.UserId == userId).ToListAsync();

            if (accounts == null)
            {
                return NotFound();
            }

            return accounts;
        }

        [HttpGet("GetSharedAccountsByUserId/{userId}")]
        public async Task<ActionResult<IEnumerable<AccountShare>>> GetSharedAccountsByUserId(int userId)
        {
            var sharedAccounts = await _context.AccountShares
                .Include(a => a.Account)
                .Where(a => a.SharedWith == userId)
                .ToListAsync();

            if (sharedAccounts == null || !sharedAccounts.Any())
            {
                return NotFound();
            }

            return sharedAccounts;
        }

    }
}
