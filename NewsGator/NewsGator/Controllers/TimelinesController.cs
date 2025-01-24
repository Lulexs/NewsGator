using MongoDB.Bson;
using NewsGator.ApplicationLogic;
using NewsGator.Dtos;
using NewsGator.Models;

namespace NewsGator.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TimelinesController : ControllerBase
{
    private readonly TimelinesLogic _timelinesLogic;
    private readonly ILogger<TimelinesController> _logger;
    private readonly NewsLogic _newsLogic; // REMOVE THIS

    public TimelinesController(TimelinesLogic timelinesLogic, ILogger<TimelinesController> logger, NewsLogic newsLogic)
    {
        _timelinesLogic = timelinesLogic;
        _logger = logger;
        _newsLogic = newsLogic;
    }

    [HttpPost("")]
    public IActionResult CreateTimeline([FromBody] CreateTimelineDto dto)
    {
        Console.WriteLine(dto.Name);
        foreach (var id in dto.NewsIds ?? [])
        {
            Console.WriteLine(id);
        }
        return Ok();
    }

    [HttpPut("")]
    public IActionResult UpdateTimeline([FromBody] UpdateTimelineDto dto)
    {
        Console.WriteLine(dto.Name);
        foreach (var id in dto.NewsIds ?? [])
        {
            Console.WriteLine(id);
        }
        return Ok();
    }

    [HttpDelete("{timelineId}")]
    public IActionResult DeleteTimeline(string timelineId)
    {
        return Ok();
    }

    [HttpGet("{timelineId}")]
    public IActionResult GetTimeline(string timelineId)
    {
        return Ok();
    }

    [HttpGet("")]
    public async Task<IActionResult> GetTimelines([FromQuery] int cursor)
    {
        var timelines = new[] {
            new { Id = ObjectId.GenerateNewId().ToString(), Name = "Test timeline 1", News = await _newsLogic.GetMostRecentNews(0) },
            new { Id = ObjectId.GenerateNewId().ToString(), Name = "Test timeline 2", News = await _newsLogic.GetMostRecentNews(0) }
        };

        return Ok(new { data = timelines });
    }
}