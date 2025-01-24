using NewsGator.ApplicationLogic;
using NewsGator.Dtos;

namespace NewsGator.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TimelinesController : ControllerBase
{
    private readonly TimelinesLogic _timelinesLogic;
    private readonly ILogger<TimelinesController> _logger;

    public TimelinesController(TimelinesLogic timelinesLogic, ILogger<TimelinesController> logger)
    {
        _timelinesLogic = timelinesLogic;
        _logger = logger;
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
    public IActionResult GetTimelines([FromQuery] int cursor)
    {
        return Ok();
    }
}