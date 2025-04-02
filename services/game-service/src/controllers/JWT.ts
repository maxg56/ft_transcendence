import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

function verifyToken(token: string): [string, string] | [null, null] {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { username: string; id: string };
    return [decoded.id, decoded.username];
  } catch {
    return [null, null];
  }
}


export { verifyToken };