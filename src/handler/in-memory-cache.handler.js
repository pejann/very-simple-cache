const { blankCacheData, createCacheDataByUnixTimestamp } = require('../helper/cache-data')

/* Stores the cache in memory */
const storage = {}

/**
 * Recovers a value that refers to a key passed as parameter. In this case the
 * returned value includes the time to expire, data and key
 *
 * @param { string } key Cache key
 * @returns { Promise<CacheData> }
 */
const get = (key) => {

    if (!storage[key]) { return Promise.resolve(blankCacheData()) }

    return Promise.resolve(storage[key])

}

/**
 * Inserts new data in the cache or updates a data already there.
 *
 * @param { string } key Cache key to be inserted or updated in cache
 * @param { * } data Any data to be inserted or updated in cache
 * @param { number } expirationTimestamp Expiration timestamp for the key
 * @returns {Promise<CacheData>}
 */
const upsert = (key, data, expirationTimestamp) => {

    storage[key] = createCacheDataByUnixTimestamp(key, data, expirationTimestamp)
    return Promise.resolve(storage[key])

}

/**
 * Removes a key from cache
 *
 * @param { string } key The cache key to be removed
 * @returns { Promise<boolean> }
 */
const remove = (key) => {

    return get(key).then(entidade => {

        if (entidade) { delete storage[key] }

        return Promise.resolve(true)

    })

}

/**
 * Removes every key in cache
 * @return Promise<boolean>
 */
const flush = () => {

    Object.keys(storage).map(key => { delete storage[key] })

    return Promise.resolve(true)

}

module.exports = {
    get,
    upsert,
    remove,
    flush
}
