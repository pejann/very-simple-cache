const { createCacheService } = require('./src/service/cache.service')
const inMemoryCacheHandler = require('./src/handler/in-memory-cache.handler')

module.exports = {
    createCacheService,
    inMemoryCacheHandler
}
