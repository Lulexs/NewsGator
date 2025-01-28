using System.Threading.Tasks;
using MongoDB.Bson;
using NewsGator.ApplicationLogic;
using NewsGator.Dtos;
using NewsGator.Models;

// TODO: napravi indeks za po datumu kreiranja
namespace NewsGator.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PollsController : ControllerBase
{
    private readonly PollsLogic _pollsLogic;
    private readonly ILogger<PollsController> _logger;

    public PollsController(PollsLogic pollsLogic, ILogger<PollsController> logger)
    {
        _pollsLogic = pollsLogic;
        _logger = logger;
    }

    [HttpPost("")]
    public async Task<IActionResult> CreatePoll([FromBody] CreatePollDto dto)
    {
        try
        {
            if(dto == null || string.IsNullOrEmpty(dto.Question) || dto.Options == null || dto.Options.Count < 2)
            {
                _logger.LogWarning("Invalid data provided for poll creation");
                return BadRequest("Invalid poll data. Please ensure question and options are provided.");
           
            }

            var duplicateOptions = dto.Options
            .GroupBy(option => option)
            .Where(group => group.Count() > 1)
            .Select(group => new { Option = group.Key, Count = group.Count() })
            .ToList();

            if (duplicateOptions.Any())
            {
                var duplicateMessages = duplicateOptions
                    .Select(dup => $"Option '{dup.Option}' appears {dup.Count} times.")
                    .ToList();

                _logger.LogWarning("Duplicate options found: {Duplicates}", string.Join(", ", duplicateMessages));
                return BadRequest(new
                {
                    Message = "Duplicate options found in the poll.",
                    Duplicates = duplicateMessages
                });
            }



            var createdPoll = await _pollsLogic.CreatePoll(dto.Question, dto.Options);


             _logger.LogInformation("Poll created successfully with question: {Question}, ID: {PollId}", createdPoll.Question, createdPoll.Id);
            return Ok("Poll " + createdPoll.Question + " created successfully");
        }
        catch(Exception ec)
        {
            _logger.LogError("Error occured while adding new poll, {}", ec.Message);
            return StatusCode(500, "Failed to create new poll, please try again latter");
        }
    }

    [HttpGet("")]
    public async Task<IActionResult> GetPollsForEditor()
    {
        try 
        {
            var polls = await _pollsLogic.GetPollsSortedByDate();
            if (!polls.Any())
            {
                _logger.LogInformation("No polls found.");
                return NotFound(new { Message = "No polls found." });
            }

            return Ok(polls);
        }
        catch(Exception ec)
        {
            _logger.LogError("Error occured while fetching polls, {}", ec.Message);
            return StatusCode(500, "Failed to fetch polls, please try again latter");
        }
    }

    [HttpGet("latest/{userId}")]
    public async Task<IActionResult> GetPollForHomePage(string userId)
    {
        // Lulexs note: Returns latest poll

        try
        {
            var latestPoll = await _pollsLogic.GetLatestPoll();
            if (latestPoll == null)
            {
                _logger.LogInformation("No polls found.");
                return NotFound(new { Message = "No polls found." });
            }
            _logger.LogInformation("Latest poll found with question: {Question}, ID: {PollId}", latestPoll.Question, latestPoll.Id);
            return Ok(latestPoll);
        }
        catch(Exception ec)
        {
            _logger.LogError("Error occured while fetching latest poll, {}", ec.Message);
            return StatusCode(500, "Failed to fetch latest poll, please try again latter");
        }

    }

    [HttpPut("vote")]
    public async Task<IActionResult> Vote([FromBody] VoteDto dto)
    {
        try
        {
            if (dto == null || string.IsNullOrEmpty(dto.PollId) || string.IsNullOrEmpty(dto.UserId) || string.IsNullOrEmpty(dto.Option))
            {
                _logger.LogWarning("Invalid data provided for voting");
                return BadRequest("Invalid vote data. Please ensure poll ID, user ID and option are provided.");
            }

            var result = await _pollsLogic.Vote(dto.PollId, dto.UserId, dto.Option);
            if (!result)
            {
                _logger.LogWarning("Failed to vote on poll with ID {PollId}", dto.PollId);
                return BadRequest("Failed to vote on the poll.");
            }

            _logger.LogInformation("Vote on poll with ID {PollId} successful", dto.PollId);
            return Ok("Vote successful for poll " + dto.PollId + " and option " + dto.Option);
        }
        catch(Exception ec)
        {
            _logger.LogError("Error occured while voting, {}", ec.Message);
            return StatusCode(500, "Failed to vote, please try again latter");
        }
    }

    [HttpDelete("{pollId}")]
    public async Task<IActionResult> DeletePoll(string pollId)
    {
        try
        {
            var result = await _pollsLogic.DeletePoll(pollId);
            if (!result)
            {
                _logger.LogWarning("Failed to delete poll with ID {PollId}", pollId);
                return BadRequest("Failed to delete poll.");
            }
            _logger.LogInformation("Poll with ID {PollId} deleted successfully", pollId);
            return Ok("Poll " + pollId + " deleted successfully");
        }
        catch(FormatException)
        {
            _logger.LogWarning("Invalid poll ID provided for deletion");
            return BadRequest("Invalid poll ID provided for deletion");
        }
        catch(Exception ec)
        {
            _logger.LogError("Error occured while deleting poll, {}", ec.Message);
            return StatusCode(500, "Failed to delete poll, please try again latter");
        }
    }
}