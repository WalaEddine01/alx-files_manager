import redisClient from "./utils/redis";
import dbClient from "./utils/db";

async function main() {
    // Test RedisClient
    console.log("Redis client alive:", redisClient.isAlive());
  
    // Set and get a key in Redis
    await redisClient.set('test_key', 'test_value', 60);
    const value = await redisClient.get('test_key');
    console.log('Value for "test_key" in Redis:', value);
  
    // Test DBClient
    // Wait a moment to ensure the DB client is connected
    setTimeout(async () => {
      console.log("DB client alive:", dbClient.isAlive());
  
      // Count users and files in MongoDB
      const userCount = await dbClient.nbUsers();
      const fileCount = await dbClient.nbFiles();
      console.log('Number of users in DB:', userCount);
      console.log('Number of files in DB:', fileCount);
    }, 1000); // Wait 1 second to allow connection to complete
  }
  
  main().catch(console.error);