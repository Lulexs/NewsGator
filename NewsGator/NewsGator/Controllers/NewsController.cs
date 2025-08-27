using System.Collections.Concurrent;
using MongoDB.Bson;
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

    [HttpGet("")]
    public async Task<IActionResult> GetNewsForEditor([FromQuery] int cursor)
    {
        try
        {
            var totalNews = await _newsLogic.GetNewsCount();
            var news = await _newsLogic.GetNewsForEditor(cursor);

            if (cursor + 8 < totalNews)
                return Ok(new { data = news, nextCursor = cursor + 8 });
            return Ok(new { data = news });
        }
        catch (Exception ec)
        {
            _logger.LogError("Error occured while getting all news for editor, {}", ec.Message);
            return BadRequest("Failed to acquire news, please try again");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSingleNews(string id)
    {
        try
        {
            var res = await _newsLogic.GetSingleNews(ObjectId.Parse(id));
            if (res == null)
            {
                return NotFound("News not found, possibly deleted");
            }

            return Ok(new
            {
                Id = res.Id.ToString(),
                CommunityNote = res.CommunityNote == null ? null : new { res.CommunityNote.Text, res.CommunityNote.Upvotes, res.CommunityNote.Downvotes },
                res.CreatedAt,
                res.Location,
                res.NewspaperNews,
                res.Thumbnail,
                res.Title
            });
        }
        catch (Exception e)
        {
            _logger.LogError("Error occured while getting single news with id {}, {}", id, e.Message);
            return BadRequest("Failed to acquire single news, please try again");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSingleNews(string id, [FromBody] NewsDto dto)
    {
        try
        {
            await _newsLogic.UpdateSingleNews(ObjectId.Parse(id), dto);
            return Ok();
        }
        catch (Exception e)
        {
            _logger.LogError("Error occured while updating single news with id {}, {}", id, e.Message);
            return BadRequest("Failed to update news, please try again");
        }
    }

    [HttpGet("filter")]
    public async Task<IActionResult> GetFilteredNews(string filter)
    {
        try
        {
            var res = await _newsLogic.GetFilteredNewsForEditor(filter);
            return Ok(res);
        }
        catch (Exception ec)
        {
            _logger.LogError("Error occured while fetching filtered news for editor with filter {}, {}", filter, ec.Message);
            return BadRequest("Failed to filter news, please try again");
        }
    }

    [HttpGet("mostrecent")]
    public async Task<IActionResult> GetMostRecentNews([FromQuery] int cursor)
    {
        try
        {
            var totalNews = await _newsLogic.GetNewsCount();
            var news = await _newsLogic.GetMostRecentNews(cursor);

            if (cursor + 8 < totalNews)
                return Ok(new { data = news, nextCursor = cursor + 8 });

            return Ok(new { data = news });
        }
        catch (Exception ec)
        {
            _logger.LogError("Error occured while fetching home page news {}", ec.Message);
            return BadRequest("Failed to acquire news, please reload page");
        }
    }

    [HttpGet("mostpopular")]
    public async Task<IActionResult> GetMostPopularNews()
    {
        try
        {
            var mostPopular = await _newsLogic.GetMostPopularNews();

            return Ok(mostPopular);
        }
        catch (Exception ec)
        {
            _logger.LogError("Error occured while fetching home page news {}", ec.Message);
            return BadRequest("Failed to acquire news, please reload page");
        }
    }


    [HttpGet("forreader/{userId}/{id}")]
    public async Task<IActionResult> GetSingleNewsForReader(string userId, string id)
    {
        try
        {
            var singleNews = await _newsLogic.GetSingleNewsForReader(ObjectId.Parse(userId), ObjectId.Parse(id));
            return Ok(singleNews);
        }
        catch (Exception ec)
        {
            _logger.LogError("Error occurred while fetching news with id {} for user {}, {}", id, userId, ec.Message);
            return BadRequest("Failed to acquire news, please try again.");
        }
    }

    [HttpGet("filteroptions")]
    public async Task<ActionResult<FilterOptionsDto>> GetFilterOptions()
    {
        try
        {
            var filterOptions = await _newsLogic.GetFilterOptions();
            return Ok(filterOptions);
        }
        catch (Exception ec)
        {
            _logger.LogError("Error occured while fetching all filter options, {}", ec.Message);
            return BadRequest("Failed to acquire filter options, please try again");
        }
    }

    [HttpPost("filter")]
    public async Task<ActionResult<List<NewsForEditor>>> GetFilteredNews([FromBody] NewsFilterDto dto, [FromQuery] int cursor)
    {
        try
        {
            var filteredNews = await _newsLogic.GetFilteredNews(dto, cursor);

            if (cursor + 8 < filteredNews.FilteredNewsCount)
                return Ok(new { data = filteredNews.Results, nextCursor = cursor + 8 });

            return Ok(new { data = filteredNews.Results });
        }
        catch (Exception ec)
        {
            _logger.LogError("Error occured while getting filtered news, {}", ec.Message);
            return BadRequest("Failed to acquire news, please try again");
        }
    }

    [HttpGet("reviews/{newsId}")]
    public async Task<ActionResult<List<ReviewDto>>> GetNewsReviews(string newsId)
    {
        try
        {
            var reviews = await _newsLogic.GetNewsReviews(ObjectId.Parse(newsId));
            return Ok(reviews);
        }
        catch (Exception e)
        {
            _logger.LogError("Error occured while fetching reviews for news with id {}, {}", newsId, e.Message);
            return BadRequest("Failed to fetch reviews, please try again");
        }
    }

    [HttpPost("leavereview/{newsId}")]
    public async Task<IActionResult> LeaveReview(string newsId, [FromBody] ReviewDto dto)
    {
        try
        {
            await _newsLogic.LeaveReview(ObjectId.Parse(newsId), dto);
            return Ok();
        }
        catch (Exception e)
        {
            _logger.LogError("Error occured while leaving review for news with id {}, {}", newsId, e.Message);
            return BadRequest("Failed to leave review, please try again");
        }
    }

    [HttpPut("upvotedownvote")]
    public async Task<IActionResult> UpvoteDownvote([FromBody] UpvoteDownvoteDto dto)
    {
        try
        {
            await _newsLogic.UpvoteDownvote(ObjectId.Parse(dto.NewsId), ObjectId.Parse(dto.UserId), dto.Action);
            return Ok();
        }
        catch (Exception e)
        {
            _logger.LogError("Error occured while upvoting/downvoting community note for news with id {}, {}", dto.NewsId, e.Message);
            return BadRequest(e.Message);
        }
    }
}
