using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NDAccountManager.Data;
using NDAccountManager.Models;
using System.Linq;
using System.Threading.Tasks;

namespace NDAccountManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetUserIdByAzureAdId/{azureAdId}")]
        public async Task<ActionResult<int>> GetUserIdByAzureAdId(string azureAdId)
        {
            var user = await _context.Users
                .Where(u => u.AzureAdId == azureAdId)
                .Select(u => u.UserId)
                .FirstOrDefaultAsync();

            if (user == default)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("GetRolesAndUsers")]
        public async Task<ActionResult> GetRolesAndUsers()
        {
            var roles = new List<string> { "Managers", "Developers", "Sales", "Supports" };
            var users = await _context.Users.Select(u => new { u.UserId, u.Name }).ToListAsync();

            return Ok(new { roles, users });
        }



    }
}
