using System.Security.Authentication;
using System.Security.Cryptography;
using System.Text;
using MongoDB.Bson;
using MongoDB.Driver;
using NewsGator.Dtos;
using NewsGator.Models;
using NewsGator.Persistence;

namespace NewsGator.ApplicationLogic;

public class UsersLogic
{

    public string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    public async Task<User> RegisterUser(UserRegisterDto userDto)
    {
        var collection = MongoSessionManager.GetCollection<User>("users");

        var existingUser = await collection.Find(
            Builders<User>.Filter.Or(
                Builders<User>.Filter.Eq(u => u.Username, userDto.Username),
                Builders<User>.Filter.Eq(u => u.Email, userDto.Email)
            )
        ).FirstOrDefaultAsync();

        if (existingUser != null)
        {
            if (existingUser.Username == userDto.Username)
                throw new ArgumentException("Username already exists.");
            if (existingUser.Email == userDto.Email)
                throw new ArgumentException("Email already exists.");
        }

        var user = new User
        {
            Id = ObjectId.GenerateNewId(),
            Username = userDto.Username,
            Email = userDto.Email,
            HashedPassword = HashPassword(userDto.Password),
            Avatar = userDto.Avatar,
            Role = UserRole.Reader
        };

        await collection.InsertOneAsync(user);

        return user;
    }

    public async Task<User> LoginUser(UserLoginDto userDto)
    {
        var collection = MongoSessionManager.GetCollection<User>("users");

        var user = await collection.Find(u => u.Username == userDto.Username).FirstOrDefaultAsync();

        if (user == null || HashPassword(userDto.Password) != user.HashedPassword)
        {
            throw new AuthenticationException("Invalid username or password.");
        }

        return user;
    }

    public async Task<User> UpdateUser(ObjectId userId, UpdateUserDto updateDto)
    {
        var userCollection = MongoSessionManager.GetCollection<User>("users");
        var newsCollection = MongoSessionManager.GetCollection<News>("news");

        var updates = new List<UpdateDefinition<User>>();

        if (!string.IsNullOrEmpty(updateDto.Email))
            updates.Add(Builders<User>.Update.Set(u => u.Email, updateDto.Email));

        if (!string.IsNullOrEmpty(updateDto.Avatar))
            updates.Add(Builders<User>.Update.Set(u => u.Avatar, updateDto.Avatar));

        if (updateDto.Subscriptions != null)
        {
            var subs = new UserSubscriptions
            {
                Authors = updateDto.Subscriptions.Authors?.ToArray(),
                Newspapers = updateDto.Subscriptions.Newspapers?.ToArray(),
                Categories = updateDto.Subscriptions.Categories?.ToArray()
            };
            updates.Add(Builders<User>.Update.Set(u => u.Subscriptions, subs));
        }

        if (updateDto.Bookmarks != null)
        {
            var newsIds = updateDto.Bookmarks
                .Select(id => ObjectId.Parse(id))
                .ToList();

            var bookmarkItems = await newsCollection
                .Find(n => newsIds.Contains(n.Id))
                .Project(n => new ThumbnailedNews
                {
                    NewsId = n.Id,
                    Title = n.Title,
                    Thumbnail = n.Thumbnail
                })
                .ToListAsync();

            updates.Add(Builders<User>.Update.Set(u => u.Bookmarks, bookmarkItems));
        }

        if (updates.Count != 0)
        {
            var updateDefinition = Builders<User>.Update.Combine(updates);
            await userCollection.UpdateOneAsync(u => u.Id == userId, updateDefinition);
        }

        var user = await userCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
        return user;

    }

}
