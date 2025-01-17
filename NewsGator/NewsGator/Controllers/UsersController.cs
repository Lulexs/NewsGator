
using MongoDB.Driver;
using NewsGator.Dtos;
using NewsGator.Models;
using NewsGator.Persistence;

namespace NewsGator.Controllers; 

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase {

    [HttpPost("login")]
    public async Task<ActionResult<User>> Login([FromBody]UserLoginDto userDto) {
        var users = MongoSessionManager.GetCollection<User>("users");
        var user = await users.Find(u => u.Username == userDto.Username).FirstOrDefaultAsync();

        if (user == null) {
            return NotFound("User not found");
        }

        return Ok(new {
            id = user.Id.ToString(),
            user.Avatar,
            user.Username,
            user.Email,
            user.Role,
            user.Subscriptions,
            user.Bookmarks
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody]UserRegisterDto userDto) {
        var users = MongoSessionManager.GetCollection<User>("users");
        await users.InsertOneAsync(new User() {
            Email = userDto.Email,
            Avatar = userDto.Avatar,
            HashedPassword = userDto.Password,
            Username = userDto.Username,
            Role = UserRole.Reader
        });
        return Ok();
    }
}
