const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'mydatabase';

async function main() {
    try {
        // Use connect method to connect to the server
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);

        // Specify the collection to use
        const collection = db.collection('documents');

        // Insert some documents
        const insertResult = await collection.insertMany([{ a: 1 }, { b: 2 }, { c: 3 }]);
        console.log('Inserted documents =>', insertResult);

        // Find all documents
        const findResult = await collection.find({}).toArray();
        console.log('Found documents =>', findResult);
    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection
        await client.close();
    }
}

main().catch(console.error);
