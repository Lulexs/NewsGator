using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Bson;
using MongoDB.Driver;
using NewsGator.Dtos;
using NewsGator.Models;
using NewsGator.Persistence;

namespace NewsGator.ApplicationLogic;
public class NewsLogic
{
    public async Task CreateNews(NewsDto dto)
    {
        var collection = MongoSessionManager.GetCollection<News>("news");

        await collection.InsertOneAsync(new News()
        {
            Title = dto.Title,
            CreatedAt = DateTime.Now,
            Location = dto.Location,
            Thumbnail = dto.Thumbnail,
            CommunityNote = dto.CommunityNotes,
            NewspaperNews = dto.NewspaperNews
        });
    }

    public async Task<List<NewsForEditor>> GetNewsForEditor(int count)
    {
        var collection = MongoSessionManager.GetCollection<News>("news");

        var projection = Builders<News>.Projection.Expression(news => new NewsForEditor
        {
            Id = news.Id.ToString(),
            Title = news.Title,
            CreatedAt = news.CreatedAt,
            Thumbnail = news.Thumbnail
        });
        var sort = Builders<News>.Sort.Descending(p => p.CreatedAt);

        var res = await collection.Find(news => true)
                                   .Project(projection)
                                   .Sort(sort)
                                   .Skip(count)
                                   .Limit(8)
                                   .ToListAsync();

        return res ?? [];
    }

    public async Task<News?> GetSingleNews(ObjectId id)
    {
        var collection = MongoSessionManager.GetCollection<News>("news");

        var res = await collection.Find(x => x.Id == id).FirstOrDefaultAsync();

        return res;
    }

    public async Task<long> GetNewsCount()
    {
        var collection = MongoSessionManager.GetCollection<News>("news");

        var res = await collection.CountDocumentsAsync(news => true);
        return res;
    }

    public async Task UpdateSingleNews(ObjectId id, NewsDto dto)
    {
        var collection = MongoSessionManager.GetCollection<News>("news");

        var filter = Builders<News>.Filter.Eq(x => x.Id, id);
        var update = Builders<News>.Update
            .Set(x => x.Title, dto.Title)
            .Set(x => x.Location, dto.Location)
            .Set(x => x.Thumbnail, dto.Thumbnail)
            .Set(x => x.CommunityNote, dto.CommunityNotes)
            .Set(x => x.NewspaperNews, dto.NewspaperNews);

        await collection.FindOneAndUpdateAsync(filter, update);
    }

    // public async Task GetFullFilteredNews(NewsFilterDto dto) {

    // }

    public async Task<List<NewsForEditor>> GetFilteredNewsForEditor(string title)
    {
        var collection = MongoSessionManager.GetCollection<News>("news");

        var filter = Builders<News>.Filter.Regex("Title", new BsonRegularExpression(title, "i"));
        var projection = Builders<News>.Projection.Expression(news => new NewsForEditor
        {
            Id = news.Id.ToString(),
            Title = news.Title,
            CreatedAt = news.CreatedAt,
            Thumbnail = news.Thumbnail
        });

        var results = await collection.Find(filter).Project(projection).ToListAsync();

        return results;
    }
}
