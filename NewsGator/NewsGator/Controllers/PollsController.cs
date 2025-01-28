using System.Threading.Tasks;
using MongoDB.Bson;
using NewsGator.ApplicationLogic;
using NewsGator.Dtos;
using NewsGator.Models;

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



            await _pollsLogic.CreatePoll(dto.Question, dto.Options);


            _logger.LogInformation("Poll created successfully with question: {Question}", dto.Question);
            return Ok("Poll created successfully");
        }
        catch(Exception ec)
        {
            _logger.LogError("Error occured while adding new poll, {}", ec.Message);
            return StatusCode(500, "Failed to create new poll, please try again latter");
        }
    }

    [HttpGet("")]
    public IActionResult GetPollsForEditor()
    {
        var random = new Random();
        var polls = Enumerable.Range(1, 10)
            .Select(i => new
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Question = $"Do you support *topic {i}*?",
                Options = Enumerable.Range(1, random.Next(2, 6))
                    .Select(j => new
                    {
                        Option = $"Option {j}",
                        Votes = random.Next(0, 100)
                    }).ToArray(),
                DatePosted = DateTime.Now.AddDays(-random.Next(0, 31))
            }).ToArray();
        return Ok(polls);
    }

    [HttpGet("latest/{userId}")]
    public IActionResult GetPollForHomePage(string userId)
    {
        // Lulexs note: Returns latest poll

        return Ok(new
        {
            Id = ObjectId.GenerateNewId().ToString(),
            Question = "Do you support toppic something",
            Options = new[]
                {
                    new { Option = "No", Votes = 48 },
                    new { Option = "Yes", Votes = 53 }
                },
            UserVote = "Yes",
            DatePosted = DateTime.Now
        });
    }

    [HttpPut("vote")]
    public IActionResult Vote([FromBody] VoteDto dto)
    {
        Console.WriteLine(dto.PollId);
        Console.WriteLine(dto.UserId);
        Console.WriteLine(dto.Option);
        return Ok();
    }

    [HttpDelete("{pollId}")]
    public IActionResult DeletePoll(string pollId)
    {
        return Ok();
    }
}