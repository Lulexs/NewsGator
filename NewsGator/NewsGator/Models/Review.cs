using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NewsGator.Models; 
public class Review {
    [BsonId]
    public ObjectId Id { get; set; }
    public ObjectId NewsId { get; set; }
    public int Value { get; set; }
    public string? Comment { get; set; }
}
