import crypto from 'crypto';
import dbClient from '../utils/db';

const postNew = async (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).send({ error: 'Missing email' });
  if (!password) return res.status(400).send({ error: 'Missing password' });
  const c = dbClient.db.collection('users');
  const a = await c.findOne({
    email,
  });

  if (a) {
    return res.status(400).send({ error: 'Already exist' });
  }

  const hash = crypto.createHash('SHA1');
  hash.update(password);
  const hasedpas = hash.digest('hex');

  const insert = await c.insertOne({
    email,
    password: hasedpas,
  });
  return res.status(201).send({
    email,
    id: insert.insertedId,
  });
};

export default postNew;
