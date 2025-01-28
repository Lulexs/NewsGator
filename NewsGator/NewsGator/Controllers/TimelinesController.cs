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
    public async Task<IActionResult> CreateTimeline([FromBody] CreateTimelineDto dto)
    {
        try
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Name))
            {
                _logger.LogError("Invalid data provided for timeline creation.");
                return BadRequest(new { message = "Invalid data provided for timeline creation." });
            }
            _logger.LogInformation("Creating timeline with name {Name}", dto.Name);
            foreach(var id in dto.NewsIds ?? new List<string>())
            {
                _logger.LogInformation("Associated news ID: {Id}", id);
            }
            var timelineId = await _timelinesLogic.CreateTimeline(dto);
            _logger.LogInformation("Timeline created succesfully with ID {Id}", timelineId);
            return Ok(dto.Name + " timeline created successfully with ID " + timelineId);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error creating timeline");
            return StatusCode(500);
        }
    }

    [HttpPut("")]
    public async Task<IActionResult> UpdateTimeline([FromBody] UpdateTimelineDto dto)
    {
        try
        {
            if(dto == null || string.IsNullOrWhiteSpace(dto.Id) || string.IsNullOrWhiteSpace(dto.Name))
            {
                _logger.LogError("Invalid data provided for timeline update.");
                return BadRequest(new { message = "Invalid data provided for timeline update." });
            }

            var result = await _timelinesLogic.UpdateTimeline(dto);

            if(!result)
            {
                _logger.LogError("Failed to update timeline with ID {Id}", dto.Id);
                return BadRequest(new { message = "Failed to update timeline." });
            }
            _logger.LogInformation("Timeline with ID {TimelineId} successfully updated.", dto.Id);
            return Ok(new { Message = "Timeline successfully updated." });
        }
        catch(FormatException ec)
        {
            _logger.LogError("Invalid timeline ID, {}", ec.Message);
            return BadRequest("Invalid timeline information format, please try again with valid information");
        }
        catch(Exception ec)
        {
            _logger.LogError("Error occured while updating timeline, {}", ec.Message);
            return BadRequest("Failed to update timeline, please try again latter");
        }
    }

    [HttpDelete("{timelineId}")]
    public async Task<IActionResult> DeleteTimeline(string timelineId)
    {
        try
        {
            if(string.IsNullOrWhiteSpace(timelineId))
            {
                _logger.LogError("Invalid timeline ID provided for deletion.");
                return BadRequest(new { message = "Invalid timeline ID provided for deletion." });
            }

            var result = await _timelinesLogic.DeleteTimeline(timelineId);

            if(!result)
            {
                _logger.LogError("Failed to delete timeline with ID {Id}", timelineId);
                return BadRequest(new { message = "Failed to delete timeline." });
            }
            _logger.LogInformation("Timeline with ID {TimelineId} successfully deleted.", timelineId);
            return Ok(new { Message = "Timeline successfully deleted." });
        }
        catch(FormatException ec)
        {
            _logger.LogError("Invalid timeline ID, {}", ec.Message);
            return BadRequest("Invalid timeline ID, please try again with valid timeline ID");
        }
        catch(Exception ec)
        {
            _logger.LogError("Error occured while deleting timeline with ID {}, {}", timelineId, ec.Message);
            return BadRequest("Failed to delete timeline, please try again");
        }
    }

    [HttpGet("{timelineId}")]
    public async Task<IActionResult> GetTimeline(string timelineId)
    {
        try
        {
            if(string.IsNullOrWhiteSpace(timelineId))
            {
                _logger.LogError("Invalid timeline ID provided for getting timeline.");
                return BadRequest(new { message = "Invalid timeline ID provided for getting timeline." });
            }

            var timelineObjectId = new ObjectId(timelineId);
            var timeline = await _timelinesLogic.GetTimeline(timelineObjectId);

            if(timeline == null)
            {
                _logger.LogError("Failed to get timeline with ID {Id}", timelineId);
                return BadRequest(new { message = "Failed to get timeline." });
            }
            _logger.LogInformation("Timeline with ID {TimelineId} successfully retrieved.", timelineId);
            return Ok(new
            {
                Id = timeline.Id.ToString(),
                Name = timeline.Name,
                News = (timeline.News ?? new List<ThumbnailedNews>()).Select(n => new
                {
                    NewsId = n.NewsId.ToString(),
                    Title = n.Title,
                    Thumbnail = n.Thumbnail
                }).ToList()  // Dodaj `.ToList()` da bi se pravilno kreirao anonimni objekat
            });
        }
        catch(FormatException ec)
        {
            _logger.LogError("Invalid timeline ID, {}", ec.Message);
            return BadRequest("Invalid timeline ID, please try again with valid timeline ID");
        }
        catch(Exception ec)
        {
            _logger.LogError("Error occured while getting timeline with ID {}, {}", timelineId, ec.Message);
            return BadRequest("Failed to acquire timeline, please try again");
        }
    }

    [HttpGet("")]
    public async Task<IActionResult> GetTimelines([FromQuery] int cursor)
    {
        try
        {
            var totalTimelines = await _timelinesLogic.GetTimelinesCount();
            var timelines = await _timelinesLogic.GetTimelines(cursor);
            if(cursor + 8 < totalTimelines)
            {
                return Ok(new { data = timelines, nextCursor = cursor + 8 });
            }
            return Ok(new { data = timelines });
        }
        catch (Exception ec)
        {
            _logger.LogError("Error occured while getting all timelines, {}", ec.Message);
            return BadRequest("Failed to acquire timelines, please try again");
        }
    }
}