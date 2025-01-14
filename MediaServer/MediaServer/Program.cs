MediaServer.MediaServer server = new(Path.Combine(Directory.GetCurrentDirectory(), @"..\..\..\..\..\Images"), "http://localhost:9898/");


await server.Start();