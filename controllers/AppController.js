import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const status = (req, res) => {
  res.send({
    redis: redisClient.isAlive(),
    db: dbClient.isAlive(),
  });
};

const stats = (req, res) => {
  res.send({
    users: dbClient.nbUsers(),
    files: dbClient.nbFiles(),
  });
};

export { status, stats };
