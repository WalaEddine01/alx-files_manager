import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const getConnect = async (req, res) => {
  const auth = req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(auth, 'base64').toString('utf-8');
  const [email, password] = credentials.split(':');
  if (!email) return res.status(400).send({ error: 'Missing email' });
  if (!password) return res.status(400).send({ error: 'Missing password' });
  const c = dbClient.db.collection('users');
  const a = await c.findOne({
    email,
  });
  if (a) {
    console.log(crypto.createHash('sha1').update(password).digest('hex') === a.password);
  } else {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  const token = uuidv4();
  await redisClient.set('token', token, 86400);

  return res.status(200).send({ token });
};

export default getConnect;
