/**
 * Recovers a value that refers to a key passed as parameter. In this case the
 * returned value includes the time to expire, data and key
 * @param key Cache key
 * @returns
 */
declare function get(key: string): Promise<CacheData>;

/**
 * Inserts new data in the cache or updates a data already there.
 * @param key Cache key to be inserted or updated in cache
 * @param data Any data to be inserted or updated in cache
 * @param expirationTimestamp Expiration timestamp for the key
 * @returns
 */
declare function upsert(key: string, data: any, expirationTimestamp: number): Promise<CacheData>;

/**
 * Removes a key from cache
 * @param key The cache key to be removed
 * @returns
 */
declare function remove(key: string): Promise<boolean>;

/**
 * Removes every key in cache
 */
declare function flush(): any;

/**
 * Returns a blank CacheData with all fields null
 */
declare function blankCacheData(): CacheData;

/**
 * Creates a CacheData-like object based on key, data and time to live in
 * seconds
 * @param key
 * @param data
 * @param ttlInSeconds
 */
declare function createCacheDataByTtlInSeconds(key: string, data: any, ttlInSeconds: number): CacheData;

/**
 * Creates a CacheData-like object based on key, data and the expiration in
 * unix timestamp
 * @param key
 * @param data
 * @param unixTimestamp
 */
declare function createCacheDataByUnixTimestamp(key: string, data: any, unixTimestamp: number): CacheData;

/**
 * Returns the current time in unix timestamp format UTC, in seconds
 * 
 * getNowTimestamp :: () -> number
 * 
 * Example:
 * getNowTimestamp()
 * >>> 1554338608
 * @returns
 */
declare function getNowTimestamp(): number;

/**
 * Returns the current time in seconds in unix timestamp added with the seconds
 * passed as arguments
 * 
 * livefor :: int -> int
 * 
 * Example:
 * livefor(30)
 * >>> 1554338638
 * @param seconds Number of seconds to add in the current timestamp
 * @returns
 */
declare function livefor(seconds: number): number;

/**
 * Alias for get the current timestamp
 * @see getNowTimestamp now :: () -> int
 * @returns
 */
declare function now(): number;

/**
 * Get a data in the cache or, in case the data do not exists, executes a
 * function to compute the data and store in the cache
 * 
 * Examples:
 * 
 * getOrCacheThat({}, () => {}, () => {})('minha_chave', () => {}, 3600)
 * >>> Promise {}
 * @param cacheHandler Object with cache implementation
 * @param currentTimeFn Function to retrieve the current time
 * @param addSecondsFn Function to return the time with seconds added
 */
declare function getOrCacheThat(cacheHandler: CacheHandler, currentTimeFn: Function, addSecondsFn: Function): Function;

declare interface CacheHandler {
    get: Function;
    upsert: Function;
    remove: Function;
}

declare interface CacheOptions {
    currentTimeFn: Function;
    addSecondsFn: Function;
}

declare interface CacheService {
    get: Function;
    upsert: Function;
    remove: Function;
    getOrCacheThat: Function;
}

declare interface CacheData {
    unixExpirationDate: number;
    secondsToExpire: number;
    key: string;
    data: any;
}

/**
 * Checks if a initial cache handler has all the requirements to be valid
 * @param cacheHandler
 */
declare function isValidCacheHandler(cacheHandler: CacheHandler): boolean;

/**
 * Creates a cache service with a cache handler that handles the implementation
 * of the storage
 * @param cacheHandler Object with cache implementation
 * @param options Object with time grab functions
 * @returns
 */
declare function createCacheService(cacheHandler: CacheHandler, options: CacheOptions): CacheService;

