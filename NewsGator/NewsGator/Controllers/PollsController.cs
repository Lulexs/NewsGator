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
    public IActionResult CreatePoll([FromBody] CreatePollDto dto)
    {
        var pol = new Poll()
        {
            Question = dto.Question,
            Options = [.. dto.Options.Select(x => new PollOption() { Votes = 0, Option = x })],
            DatePosted = DateTime.Now,
        };
        return Ok(pol);
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