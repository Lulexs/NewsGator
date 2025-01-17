using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NewsGator.Models; 

public enum UserRole {
    Editor,
    Reader
}

public class User {
    [BsonId]
    public ObjectId Id { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string HashedPassword { get; set; }
    public required string Avatar { get; set; }
    public UserRole Role { get; set; }  
    public UserSubscriptions? Subscriptions { get; set; }
    public List<ThumbnailedNews>? Bookmarks { get; set; }
}
