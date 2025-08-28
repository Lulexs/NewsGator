
using MongoDB.Bson;
using MongoDB.Driver;
using NewsGator.ApplicationLogic;
using NewsGator.Dtos;
using NewsGator.Models;
using NewsGator.Persistence;

namespace NewsGator.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{

    private readonly UsersLogic _usersLogic;
    private readonly ILogger<UsersController> _logger;

    public UsersController(UsersLogic usersLogic, ILogger<UsersController> logger)
    {
        _usersLogic = usersLogic;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto userDto)
    {
        try
        {
            var user = await _usersLogic.RegisterUser(userDto);
            return Ok(user);
        }
        catch (Exception ec)
        {
            _logger.LogError("Error occured while registering user, {}", ec.Message);
            return BadRequest("Failed to register. " + ec.Message);
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<User>> Login([FromBody] UserLoginDto userDto)
    {

        try
        {
            var user = await _usersLogic.LoginUser(userDto);

            return Ok(new
            {
                id = user.Id.ToString(),
                user.Avatar,
                user.Username,
                user.Email,
                user.Role,
                user.Subscriptions,
                Bookmarks = user.Bookmarks?.Select(x => new { NewsId = x.NewsId.ToString(), x.Thumbnail, x.Title }).ToList()
            });
        }
        catch (Exception ec)
        {
            _logger.LogError("Error occurred while logging in user, {}", ec.Message);
            return BadRequest("Failed to log in. " + ec.Message);
        }
    }

    [HttpPut("update")]
    public async Task<IActionResult> Update([FromBody] UpdateUserDto dto)
    {
        try
        {
            var user = await _usersLogic.UpdateUser(ObjectId.Parse(dto.Id), dto);
            return Ok(new
            {
                id = user.Id.ToString(),
                user.Avatar,
                user.Username,
                user.Email,
                user.Role,
                user.Subscriptions,
                Bookmarks = user.Bookmarks?.Select(x => new { NewsId = x.NewsId.ToString(), x.Thumbnail, x.Title }).ToList()
            });
        }
        catch (Exception ec)
        {
            _logger.LogError("Error occurred while updating user, {}", ec.Message);
            return BadRequest("Failed to update user. " + ec.Message);
        }
    }
}
