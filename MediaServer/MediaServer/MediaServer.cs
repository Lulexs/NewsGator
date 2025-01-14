using System.Net;

namespace MediaServer; 

internal class MediaServer {
    private string[] _prefixes;
    private readonly HttpListener _httpListener;
    private readonly string _imageFolder;

    public MediaServer(string imageFolder, params string[] prefixes) {
        _prefixes = prefixes;
        _imageFolder = imageFolder;
        _httpListener = new();
        foreach (var s in _prefixes) {
            _httpListener.Prefixes.Add(s);
        }
    }

    public async Task Start() {
        _httpListener.Start();
        Console.WriteLine("Listening...");
        await Listen();
    }

    private async Task Listen() {
        while (true) {
            HttpListenerContext context = await _httpListener.GetContextAsync();
            Task _ = Task.Run(() => HandleRequest(context));
        }
    }

    private async void HandleRequest(HttpListenerContext context) {
        HttpListenerRequest request = context.Request;
        HttpListenerResponse response = context.Response;

        var rawUrl = request.RawUrl;

        if (rawUrl == null) {
            response.StatusCode = 400;
            response.OutputStream.Close();
        }

        string filePath = Path.Combine(_imageFolder, rawUrl![1..]);
        if (!File.Exists(filePath)) {
            response.StatusCode = 404;
            response.OutputStream.Close();
        }

        try {
            response.ContentType = "image/png";

            using var fileStream = File.OpenRead(filePath);
            response.ContentLength64 = fileStream.Length;
            await fileStream.CopyToAsync(response.OutputStream);
            await response.OutputStream.FlushAsync();
        }
        catch (Exception ex) {
            Console.WriteLine($"Error serving file: {ex.Message}");
            response.StatusCode = 500;
        }
        finally {
            response.OutputStream.Close();
        }
    }
}
