const { now, livefor, liveforInSeconds } = require('./time')
/**
 * Returns a blank CacheData with all fields null
 * @return {CacheData}
 */
const blankCacheData = () =>
  ({ unixExpirationDate: null, secondsToExpire: null, key: null, data: null })

/**
 * Creates a CacheData-like object based on key, data and time to live in
 * seconds
 * @param {string} key
 * @param {*} data
 * @param {number} ttlInSeconds
 * @return {CacheData}
 */
const createCacheDataByTtlInSeconds = (key, data, ttlInSeconds) => ({
  unixExpirationDate: livefor(ttlInSeconds),
  secondsToExpire: ttlInSeconds,
  key,
  data
})

/**
 * Creates a CacheData-like object based on key, data and the expiration in
 * unix timestamp
 * @param {string} key
 * @param {*} data
 * @param {number} unixTimestamp
 * @return {CacheData}
 */
const createCacheDataByUnixTimestamp = (key, data, unixTimestamp) => ({
  unixExpirationDate: unixTimestamp,
  secondsToExpire: liveforInSeconds(unixTimestamp),
  key,
  data
})

/**
 * Check if the cache data (CacheData) is expired
 * @param {CacheData} cacheData
 * @returns {boolean}
 */
const isExpired = (cacheData) => now() > cacheData.unixExpirationDate

module.exports = {
  blankCacheData,
  createCacheDataByTtlInSeconds,
  createCacheDataByUnixTimestamp,
  isExpired
}
