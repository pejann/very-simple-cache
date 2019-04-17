# Very Simple Cache

**This is an experimental library for a very simple implementation of cache.**

The goal of this library is to provide an abstraction for other technologies of cache like
redis, database, memcache and so on.

This library provides a way to separate the cache implementation from the interface.

## Instalation

Run:

```
npm install very-simple-cache --save
```

## Usage

Before use the cache service you need to create it.

```javascript
const { createCacheService } = require('very-simple-cache')

const cacheService = createCacheService()
```

The `cacheService` can't do anything by its own. You need to provide an implementation
of the cache you need.

The library provides a very simple in-memory cache handler for testing.

```javascript
const { createCacheService, inMemoryCacheHandler } = require('very-simple-cache')

const cacheService = createCacheService(inMemoryCacheHandler)
```

The `cacheService` provides four functions to manipulate the cache. 

### Recovering cache data

To recover cache data use the `get` function:

```
cacheService.get('my_key')
>>> Promise {CacheData}
```

The `get` function will return a `Promise` with the cache data. In case of the `inMemoryCache`
the data returned will contain the expiration date, the data and the key.

In the case of the key does not exists the `Promise` will be an empty cache data map.

**The return value will depend on the implementation.**

### Inserting or updating cache data

To insert or update cache data use the `upsert` function:

```
cacheService.upsert('my_key', 'my_data', 3600)
>>> Promise {CacheData}
```

The `upsert` function will return a `Promise` with the data inserted or updated.

**The return value will depend on the implementation.**

### Removing data from cache

To remove data from cache use the `remove` function:

```
cacheService.remove('my_key')
>>> Promise {boolean}
```

The `remove` function will return a `Promise` a boolean with the status of the action.

**The return value will depend on the implementation.**

### Wrapping get and insert together

You can use the get and upsert together with the `getOrCacheThat` function:

```
cacheService.getOrCacheThat('my_key', () => {}, 3600)
>>> Promise {Cache}
```

With that function you retrieve a Promise with the data founded with the `key` parameter.

If the value cannot be found, function passed as second parameter will be called to 
compute the new value an store in the cache. 

**The return value will depend on the implementation.**
