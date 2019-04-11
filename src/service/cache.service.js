const { now, livefor } = require('../helper/time')
const { isNil, isObject, isDate } = require('../helper/validation')
/**
 * @typedef CacheHandler
 * @type {object}
 * @property {function} get
 * @property {function} upsert
 * @property {function} remove
 */
/**
 * @typedef CacheOptions
 * @type {?object}
 * @property {?function} currentTimeFn
 * @property {?function} addSecondsFn
 */
/**
 * @typedef CacheService
 * @type {object}
 * @property {function} get
 * @property {function} upsert
 * @property {function} remove
 * @property {function} getOrCacheThat
 */

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
 * @param {function} currentTimeFn Function to retrieve the current time
 * @return {function}
 */
const get = (cacheHandler, currentTimeFn) => key => {

    return cacheHandler.get(key).then(entidade => {

        if (entidade && entidade.dtExpiracao) {

            if (currentTimeFn() > entidade.dtExpiracao) {

                return cacheHandler
                    .remove(entidade)
                    .then(() => Promise.resolve(null))
                    .catch(() => Promise.resolve(null))

            }

            return Promise.resolve(entidade)

        }

        return Promise.resolve(null)

    })

}

/**
 * Updates or inserts (in case the key already exists) a data in cache
 *
 * Examples:
 *
 * upsert({}, () => {})('minha_chave', {}, 7200)
 * >>> Promise {}
 *
 * @param {object} cacheHandler Object with cache implementation
 * @param {function} addSecondsFn Function to return the time with seconds added
 * @return {function}
 */
const upsert = (cacheHandler, addSecondsFn) => (key, data, ttlInSeconds = 7200) =>
    cacheHandler.upsert(key, data, addSecondsFn(ttlInSeconds))

/**
 * Removes a key from cache
 *
 * Examples:
 *
 * remove({})('minha_chave')
 * >>> Promise {}
 *
 * @param {object} cacheHandler Object with cache implementation
 * @return {function}
 */
const remove = (cacheHandler) => key => cacheHandler.remove(key)

/**
 * Get a data in the cache or, in case the data do not exists, executes a
 * function to compute the data and store in the cache
 *
 * Examples:
 *
 * getOrCacheThat({}, () => {}, () => {})('minha_chave', () => {}, 3600)
 * >>> Promise {}
 *
 * @param {object} cacheHandler Object with cache implementation
 * @param {function} currentTimeFn Function to retrieve the current time
 * @param {function} addSecondsFn Function to return the time with seconds added
 * @return {function}
 */
const getOrCacheThat = (cacheHandler, currentTimeFn, addSecondsFn) => (key, fn, ttl = 3600) => {

    return get(cacheHandler, currentTimeFn)(key).then(hit => {

        if (hit) { return Promise.resolve(hit.dado) }

        const promise = Promise.resolve(fn())
        return promise.then(computed => {

            upsert(cacheHandler, addSecondsFn)(key, computed, ttl)

            return Promise.resolve(computed)

        })

    })

}

const isValidCacheHandler = (cacheHandler) => {

    if (!isObject(cacheHandler)) return false

    if (isDate(cacheHandler)) return false

    return !(typeof cacheHandler.get !== 'function' ||
        typeof cacheHandler.upsert !== 'function' ||
        typeof cacheHandler.remove !== 'function')

}

/**
 * Creates a cache service with a cache handler that handles the implementation
 * of the storage
 *
 * @param {CacheHandler} cacheHandler Object with cache implementation
 * @param {CacheOptions} options Object with time grab functions
 * @returns {CacheService}
 */
const createCacheService = (cacheHandler, options = {}) => {

    if (isNil(cacheHandler)) { throw new SyntaxError('It is necessary to inform a cache handler') }

    if (!isValidCacheHandler(cacheHandler)) {

        throw new SyntaxError(
            'Cache Handler should imlement get, upsert and remove functions')

    }

    if (isNil(options)) options = {}

    if (!isObject(options) || isDate(options)) throw new SyntaxError('Options should be a valid object')

    const currentTimeFn = options['currentTimeFn']
        ? options['currentTimeFn']
        : now

    const addSecondsFn = options['addSecondsFn']
        ? options['addSecondsFn']
        : livefor

    return {
        get: get(cacheHandler, currentTimeFn),
        upsert: upsert(cacheHandler, addSecondsFn),
        remove: remove(cacheHandler),
        getOrCacheThat: getOrCacheThat(cacheHandler, currentTimeFn, addSecondsFn)
    }

}

module.exports = {
    createCacheService
}
