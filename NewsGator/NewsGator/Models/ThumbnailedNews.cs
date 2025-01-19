using MongoDB.Bson;

namespace NewsGator.Models; 
public class ThumbnailedNews {
     public ObjectId NewsId { get; set; }
    public required string Title { get; set; }
    public string? Thumbnail { get; set; }
}
