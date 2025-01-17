using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NewsGator.Models;

public class Timeline {
    [BsonId]
    public ObjectId Id { get; set; }
    public required string Name { get; set; }
    public List<ThumbnailedNews>? NewsIdsList { get; set; }
}
