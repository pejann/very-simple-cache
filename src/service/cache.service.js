const { now, livefor } = require('../helper/time')
const { isNil, isObject, isDate } = require('../helper/validation')
const { get, getOrCacheThat, upsert, remove } = require('./cache-functions')

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
 * @typedef CacheData
 * @type {object}
 * @property {number} unixExpirationDate
 * @property {number} secondsToExpire
 * @property {string} key
 * @property {*} data
 */

/**
 * Checks if a initial cache handler has all the requirements to be valid
 *
 * @param {CacheHandler} cacheHandler
 * @return {boolean}
 */
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
