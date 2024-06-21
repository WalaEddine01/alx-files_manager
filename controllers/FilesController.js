import { ObjectId } from 'mongodb';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

const postUpload = async (req, res) => {
  const token = req.headers['x-token'];
  const key = `auth_${token}`;
  const {
    name, type, parentId = '0', isPublic = false, data,
  } = req.body;

  const userID = await redisClient.get(key);

  if (!userID) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  if (!name) return res.status(400).send({ error: 'Missing name' });
  if (!type) return res.status(400).send({ error: 'Missing type' });
  if (!data && type !== 'folder') return res.status(400).send({ error: 'Missing data' });
  const c = dbClient.db.collection('users');
  let user;
  try {
    user = await c.findOne({ _id: new ObjectId(userID) });

    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const f = dbClient.db.collection('files');
    if (parentId !== '0') {
      const parentFile = await f.findOne({ _id: new ObjectId(parentId) });

      if (!parentFile) return res.status(400).send({ error: 'Parent not found' });
      if (parentFile.type !== 'folder') return res.status(400).send({ error: 'Parent is not a folder' });
    }
    const fileData = {
      userId: new ObjectId(userID),
      name,
      type,
      isPublic,
      parentId: parentId === '0' ? '0' : new ObjectId(parentId),
    };
    if (type !== 'folder') {
      if (!fs.existsSync(FOLDER_PATH)) fs.mkdirSync(FOLDER_PATH, { recursive: true });
      const localPath = path.join(FOLDER_PATH, uuidv4());
      fs.writeFileSync(localPath, Buffer.from(data, 'base64'));
    }
    const result = await f.insertOne(fileData);
    return res.status(201).send({
      id: result.insertedId,
      userId: fileData.userId,
      name: fileData.name,
      type: fileData.type,
      isPublic: fileData.isPublic,
      parentId: fileData.parentId,
    });
  } catch (error) {
    console.error('Error retrieving user:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

const getShow = async (req, res) => {
  
};

const getIndex = async (req, res) => {

};

export {
   postUpload, getShow, getIndex
  };
