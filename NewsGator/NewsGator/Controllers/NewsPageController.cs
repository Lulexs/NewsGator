
using NewsGator.Dtos;
using NewsGator.Services;
using System.Runtime.Versioning;

namespace NewsGator.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NewsPageController : ControllerBase
{

    private AcquirePageService _service;
    private readonly ILogger<NewsPageController> _logger;

    public NewsPageController(AcquirePageService service, ILogger<NewsPageController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpPost("acquire")]
    public async Task<ActionResult<string>> AcquireNewsPageImage([FromBody] string url)
    {
        try
        {
            string guid = Guid.NewGuid().ToString().Replace("-", "_");
            await _service.AcquireAsync(url, guid);

            return Ok(guid);
        }
        catch (Exception ec)
        {
            _logger.LogError("Failed to acquire image for url {} due to {}", url, ec.Message);
            return BadRequest($"Failed to load image from following url {url}");
        }
    }

    [HttpPost("crop")]
    [SupportedOSPlatform("Windows")]
    public IActionResult CropImage([FromBody] CropImageDto dto)
    {
        try
        {
            ImageService.CropImage(dto);
            return Ok();
        }
        catch (FileNotFoundException e)
        {
            _logger.LogError("Cropping image {} failed due to {}", dto.ImageName, e.Message);
            return NotFound($"News image {dto.ImageName} not found");
        }
        catch (ArgumentException)
        {
            _logger.LogError("Invalid coordinates for cropping");
            return BadRequest("Invalid coordinates for cropping");
        }
        catch (Exception e)
        {
            _logger.LogError("Cropping image {} failed due to {}", dto.ImageName, e.Message);
            return BadRequest($"Error cropping image {dto.ImageName}");
        }
    }
}
