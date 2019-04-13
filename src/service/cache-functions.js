const { blankCacheData } = require('../helper/cache-data')
/**
 * Returns a register from cache by the key or, in the case the register was not
 * found, returns null.
 * This function returns all the data in the cache in the case of InMemoryCache
 *
 * Examples:
 *
 * get({}, () => {})('minha_chave')
 * >>> Promise {null}
 *
 * @param {CacheHandler} cacheHandler Object with cache implementation
 * @return {function}
 */
const get = (cacheHandler) => (key) => {
    return cacheHandler
        .get(key)
        .then((entidade) => {
            if (!entidade) {
                return Promise.resolve(blankCacheData())
            }
            return Promise.resolve(entidade)
        })
        .catch((_) => Promise.resolve(blankCacheData()))
}

/**
 * Updates or inserts (in case the key already exists) a data in cache
 *
 * Examples:
 *
 * upsert({}, () => {})('minha_chave', {}, 7200)
 * >>> Promise {}
 *
 * @param {CacheHandler} cacheHandler Object with cache implementation
 * @return {function}
 */
const upsert = (cacheHandler) => (key, data, ttlInSeconds = 7200) => cacheHandler.upsert(key, data, ttlInSeconds)

/**
 * Removes a key from cache
 *
 * Examples:
 *
 * remove({})('minha_chave')
 * >>> Promise {}
 *
 * @param {CacheHandler} cacheHandler Object with cache implementation
 * @return {function}
 */
const remove = (cacheHandler) => (key) => cacheHandler.remove(key)

/**
 * Get a data in the cache or, in case the data do not exists, executes a
 * function to compute the data and store in the cache
 *
 * Examples:
 *
 * getOrCacheThat({}, () => {}, () => {})('minha_chave', () => {}, 3600)
 * >>> Promise {}
 *
 * @param {CacheHandler} cacheHandler Object with cache implementation
 * @return {function}
 */
const getOrCacheThat = (cacheHandler) => (key, fn, ttl = 3600) => {
    return get(cacheHandler)(key).then((hit) => {
        if (hit.data) {
            return Promise.resolve(hit.data)
        }

        const promise = Promise.resolve(fn())

        return promise.then((computed) => {
            upsert(cacheHandler)(key, computed, ttl)

            return Promise.resolve(computed)
        })
    })
}

module.exports = {
    get,
    getOrCacheThat,
    remove,
    upsert,
}
