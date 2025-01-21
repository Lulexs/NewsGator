﻿using MongoDB.Bson;
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
    public async Task<ActionResult<News?>> GetSingleNews(string id)
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
                res.CommunityNote,
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

    [HttpGet("forreader/{id}")]
    public async Task<IActionResult> GetSingleNewsForReader(string id)
    {
        try
        {
            var singleNews = await _newsLogic.GetSingleNewsForReader(ObjectId.Parse(id));

            return Ok(singleNews);
        }
        catch (Exception ec)
        {
            _logger.LogError("Error occured while fetching news with id {}, {}", id, ec.Message);
            return BadRequest("Failed to acquire news, please try again");
        }
    }
}
