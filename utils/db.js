import { createClient } from "redis";
import { promisify } from 'util';
import { MongoClient } from 'mongodb';

class DBClient {
    constructor(host="localhost", port="27017", database="files_manager") {
        this.host = host;
        this.port = port;
        this.database = database;
        this.client = new MongoClient(`mongodb://${this.host}:${this.port}`);
        this.client.connect();
    }

    isAlive() {
        return this.client.isConnected();
    }

    async nbUsers() {
        return this.client.db(this.database).collection("users").countDocuments();
    }

    async nbFiles() {
        return this.client.db(this.database).collection("files").countDocuments();
    }

}

const dbClient = new DBClient();
export default dbClient;


