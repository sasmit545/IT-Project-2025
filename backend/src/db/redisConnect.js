import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const client = createClient({
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

const redisConnection = async () => {
  try {
    client.on('error', err => console.log('Redis Client Error', err));
    if (!client.isOpen) await client.connect(); 
  } catch (error) {
    console.error('error hogya bhai:', error);
  }
};


export { client, redisConnection };
