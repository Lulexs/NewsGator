using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NewsGator.Models;

public class News
{
    [BsonId]
    public ObjectId Id { get; set; }
    public required string Title { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Location { get; set; }
    public string? Thumbnail { get; set; }
    public List<NewspaperNews>? NewspaperNews { get; set; }
    public CommunityNote? CommunityNote { get; set; }

}

public class NewsWithStringId
{
    public required string Id { get; set; }
    public required string Title { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Location { get; set; }
    public string? Thumbnail { get; set; }
    public List<NewspaperNews>? NewspaperNews { get; set; }
    public CommunityNoteForUser? CommunityNote { get; set; }

}