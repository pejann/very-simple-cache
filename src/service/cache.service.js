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

  return !(
    typeof cacheHandler.get !== 'function' ||
        typeof cacheHandler.upsert !== 'function' ||
        typeof cacheHandler.remove !== 'function'
  )
}

/**
 * Creates a cache service with a cache handler that handles the implementation
 * of the storage
 *
 * @param {CacheHandler} cacheHandler Object with cache implementation
 * @returns {CacheService}
 */
const createCacheService = (cacheHandler) => {
  if (isNil(cacheHandler)) {
    throw new SyntaxError('It is necessary to inform a cache handler')
  }

  if (!isValidCacheHandler(cacheHandler)) {
    throw new SyntaxError('Cache Handler should imlement get, upsert and remove functions')
  }

  return {
    get: get(cacheHandler),
    upsert: upsert(cacheHandler),
    remove: remove(cacheHandler),
    getOrCacheThat: getOrCacheThat(cacheHandler)
  }
}

module.exports = {
  createCacheService
}
