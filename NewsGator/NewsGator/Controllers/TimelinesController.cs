using NewsGator.ApplicationLogic;

namespace NewsGator.Controllers;

[Route("api/[controller]")]
public class TimelinesController
{
    private readonly TimelinesLogic _timelinesLogic;
    private readonly ILogger<TimelinesController> _logger;

    public TimelinesController(TimelinesLogic timelinesLogic, ILogger<TimelinesController> logger)
    {
        _timelinesLogic = timelinesLogic;
        _logger = logger;
    }
}