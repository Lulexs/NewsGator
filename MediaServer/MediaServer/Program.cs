MediaServer.MediaServer server = new(Path.Combine(AppContext.BaseDirectory, @"..\..\..\..\..\Images"), "http://localhost:9898/");

await server.Start();