import session from "express-session";
import { RedisStore } from "connect-redis";
import { redisClient } from "./redisClient.js";

export default function sessionMiddleware() {
  return session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || "keyboard_cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true in production with HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 4 // 4 hours
    }
  });
}
