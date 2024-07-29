using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace NDAccountManager.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SecureController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetSecureData()
        {
            return Ok("This is a secure data");
        }
    }
}
