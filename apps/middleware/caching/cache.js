const cache = require('memory-cache');

// Middleware for caching
module.exports.cacheMiddleware = async (duration) => {
    return (req, res, next) => {
        const key = '__express__' + req.originalUrl || req.url;
        const cachedData = cache.get(key);

        if (cachedData) {
            res.send(cachedData);
            return;
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                cache.put(key, body, duration * 1000);
                res.sendResponse(body);
            };
            next();
        }
    };
    
}