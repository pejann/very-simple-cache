/**
 * Returns the current time in unix timestamp format UTC, in seconds
 *
 * getNowTimestamp :: () -> number
 *
 * Example:
 * getNowTimestamp()
 * >>> 1554338608
 *
 * @returns {number}
 */
const getNowTimestamp = () => Math.round(new Date().getTime() / 1000)

/**
 * Returns the current time in seconds in unix timestamp added with the seconds
 * passed as arguments
 *
 * livefor :: int -> int
 *
 * Example:
 * livefor(30)
 * >>> 1554338638
 *
 * @param {number | string} seconds Number of seconds to add in the current timestamp
 * @returns {number}
 */
const livefor = (seconds) => {
    const now = getNowTimestamp()

    return typeof seconds === 'string' ? now + parseInt(seconds) : now + seconds
}

const liveforInSeconds = (timestamp) => {
    const now = getNowTimestamp()

    const unix = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp

    const diff = unix - now

    return diff <= 0 ? 0 : diff
}

/**
 * Alias for get the current timestamp
 * @see getNowTimestamp
 *
 * now :: () -> int
 *
 * @returns {number}
 */
const now = () => getNowTimestamp()

module.exports = { now, livefor, getNowTimestamp, liveforInSeconds }
