namespace NewsGator.Services; 
public class AcquirePageService {

    private IPage _page;

    public AcquirePageService(IPage page) {
        _page = page;
    }

    public async Task AcquireAsync(string url, string path) {
        await _page.GotoAsync(url);

        await _page.ContentAsync();
        await _page.ScreenshotAsync(new PageScreenshotOptions { Path=$@"..\..\Images\{path}.png" , FullPage = true });

        await _page.CloseAsync();
    }
}
