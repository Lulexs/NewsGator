
using NewsGator.Services;

namespace NewsGator.Controllers; 

[Route("api/[controller]")]
[ApiController]
public class NewsPageController : ControllerBase {

    private AcquirePageService _service;
    private readonly ILogger<NewsPageController> _logger;

    public NewsPageController(AcquirePageService service, ILogger<NewsPageController> logger) {
        _service = service;
        _logger = logger;
    }

    [HttpPost("acquire")]
    public async Task<ActionResult<string>> AcquireNewsPageImage([FromBody]string url) {
        try {
            string guid = Guid.NewGuid().ToString().Replace("-", "_");
            await _service.AcquireAsync(url, Guid.NewGuid().ToString().Replace("-", "_"));

            return Ok(guid);
        }
        catch (Exception ec) {
            _logger.LogError("Failed to acquire image for url {} due to {}", url, ec.Message);
            return BadRequest($"Failed to load image from following url {url}");
        }
    }
}
