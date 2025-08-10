// backend/middleware/auth.js
// const redis = require('../config/redisClient');

// module.exports = async function (req, res, next) {
//   try {
//     const token = req.headers['authorization'];
//     if (!token) return res.status(401).json({ error: 'No auth token' });

//     const userId = await redis.get(`session:${token}`);
//     if (!userId) return res.status(401).json({ error: 'Invalid or expired session' });

//     req.userId = userId;
//     next();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Auth error' });
//   }
// };


// backend/middleware/auth.js

// backend/middleware/auth.js
// import redis from '../config/redisClient.js';

// export default async function authMiddleware(req, res, next) {
//   try {
//     const token = req.headers['authorization'];
//     if (!token) {
//       return res.status(401).json({ error: 'No auth token' });
//     }

//     const userId = await redis.get(`session:${token}`);
//     if (!userId) {
//       return res.status(401).json({ error: 'Invalid or expired session' });
//     }

//     req.userId = userId;
//     next();
//   } catch (err) {
//     console.error('Auth middleware error:', err);
//     res.status(500).json({ error: 'Auth error' });
//   }
// }


export function ensureAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.status(401).json({ error: "Not authenticated" });
}