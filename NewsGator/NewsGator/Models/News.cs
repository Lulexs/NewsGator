using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NewsGator.Models;

public class News
{
    [BsonId]
    public ObjectId Id { get; set; }
    public required string Title { get; set; }
    public DateTime CreatedAd { get; set; }
    public string? Location { get; set; }
    public List<NewspaperNews>? NewspaperNews { get; set; }
    public CommunityNote? CommunityNote { get; set; }

}
