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
            CreatedAd = DateTime.Now,
            Location = dto.Location,
            CommunityNote = dto.CommunityNote,
            NewspaperNews = dto.NewspaperNews
        });
    }

    public async Task<List<News>> GetNewsForEditor(int count)
    {
        var collection = MongoSessionManager.GetCollection<News>("news");

        var res = await collection.Find(news => true).Skip(count).Limit(15).ToListAsync();
        return res ?? [];
    }

    public async Task<long> GetNewsCount()
    {
        var collection = MongoSessionManager.GetCollection<News>("news");

        var res = await collection.CountDocumentsAsync(news => true);
        return res;
    }
}
