using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NewsGator.Models; 
public class Click {
    [BsonId]
    public ObjectId Id { get; set;}
    public ObjectId NewsId { get; set; }
    public int Clicks { get; set; }
}
