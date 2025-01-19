using NewsGator.ApplicationLogic;
using NewsGator.Dtos;
using NewsGator.Models;

namespace NewsGator.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NewsController : ControllerBase
{

    private readonly NewsLogic _newsLogic;
    private readonly ILogger<NewsController> _logger;

    public NewsController(NewsLogic newsLogic, ILogger<NewsController> logger)
    {
        _newsLogic = newsLogic;
        _logger = logger;
    }

    [HttpPost("")]
    public async Task<IActionResult> CreateNews([FromBody] NewsDto dto)
    {
        try
        {
            await _newsLogic.CreateNews(dto);
            return Ok();
        }
        catch (Exception ec)
        {
            _logger.LogError("Error occured while adding new news, {}", ec.Message);
            return BadRequest("Failed to create new news, please try again latter");
        }
    }

    [HttpGet("{count}")]
    public async Task<IActionResult> GetNewsForEditor(int count)
    {
        try
        {
            long newsCount = await _newsLogic.GetNewsCount();
            var news = await _newsLogic.GetNewsForEditor(count);

            return Ok(new { count = newsCount, news });
        }
        catch (Exception ec)
        {
            _logger.LogError("Error occured while getting all news for editor, {}", ec.Message);
            return BadRequest("Failed to acquire news, please try again");
        }
    }
}
