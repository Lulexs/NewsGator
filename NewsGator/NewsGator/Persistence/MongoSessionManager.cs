using MongoDB.Driver;

namespace NewsGator.Persistence; 

public static class MongoSessionManager {
    private static MongoClient _client = null!;
    private static readonly object LockObject = new();
    private static readonly string _connectionString = "mongodb://localhost:27017";

    public static IMongoDatabase GetDatabase(string dbName = "news") {
        if (_client == null) {
            lock(LockObject) {
                _client ??= new MongoClient(_connectionString);
            }
        }

        return _client.GetDatabase(dbName);
    }

    public static IMongoCollection<TDocument> GetCollection<TDocument>(string collectionName, string dbName = "news") {
        var db = GetDatabase(dbName);
        return db.GetCollection<TDocument>(collectionName);
    }
}
