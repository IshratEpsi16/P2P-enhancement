
const NodeCache = require("node-cache");
const cache = new NodeCache();

module.exports = duration => (req, res, next) => {
  if (req.method != "GET") {
    console.log(`Not get request`);
    return next();
  }

  //check if key exists in cache
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);
  //if exists, send cache result
  if (cachedResponse) {
    console.log(`Cache hit for ${key}`);
  } else {
    console.log(`Cache miss for ${key}`);
    res.originalSend = res.send;
    res.send = (body) => {
      res.originalSend(body);
      cache.set(key, body, duration);
    };
  }
  next();
};
