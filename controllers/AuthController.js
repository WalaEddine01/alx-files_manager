import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const getConnect = async (req, res) => {
  try {
    const auth = req.headers.authorization.split(' ')[1];
    if (!auth) return res.status(401).send({ error: 'Unauthorized' });

    let credentials;
    try {
      credentials = Buffer.from(auth, 'base64').toString('utf-8');
    } catch (error) {
      return res.status(400).send({ error: 'Invalid Base64 content' });
    }

    const [email, password] = credentials.split(':');
    if (!email) return res.status(400).send({ error: 'Missing email' });
    if (!password) return res.status(400).send({ error: 'Missing password' });

    const c = dbClient.db.collection('users');
    const user = await c.findOne({ email });

    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
    if (user.password !== hashedPassword) {
      return res.status(401).send({ error: 'Wrong password' });
    }

    const token = uuidv4();
    const key = `auth_${token}`;
    const userID = user._id.toString();
    await redisClient.set(key, userID, 'EX', 86400);

    return res.status(200).send({ token });
  } catch (error) {
    console.error('Error in getConnect:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

module.exports = getConnect;

const getDisconnect = async (req, res) => {
  const token = req.headers['x-token'];
  const key = `auth_${token}`;
  const userID = await redisClient.get(key);
  if (userID) {
    await redisClient.del(key);
    return res.status(204).send();
  }
  return res.status(401).send({ error: 'Unauthorized' });
};

const getMe = async (req, res) => {
  const token = req.headers['x-token'];
  const key = `auth_${token}`;
  const userID = await redisClient.get(key);

  if (!userID) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  const c = dbClient.db.collection('users');
  let user;
  try {
    user = await c.findOne({ _id: new ObjectId(userID) });

    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    return res.status(200).send({ id: user._id, email: user.email });
  } catch (error) {
    console.error('Error retrieving user:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

export {
  getConnect, getDisconnect, getMe,
};
