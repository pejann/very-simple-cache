const { expect } = require('chai')
const cacheService = require('../../src/service/cache.service')
const imch = require('../../src/handler/in-memory-cache.handler')

describe('Cache Service', () => {
  describe('createCacheService', () => {
    it('should prevent cache store creation when a cache handler is invalid', () => {
      const createCacheService = () => cacheService.createCacheService(null)
      expect(createCacheService).to.throw(SyntaxError)
    })

    it('should prevent cache store creation when cache handler is undefined', () => {
      const createCacheService = () => cacheService.createCacheService()
      expect(createCacheService).to.throw(SyntaxError)
    })

    it('should prevent cache store creation when cache handler is not a valid object', () => {
      const createCacheServiceString = () => cacheService.createCacheService('string')
      expect(createCacheServiceString).to.throw(SyntaxError)

      const createCacheServiceNumber = () => cacheService.createCacheService(40)
      expect(createCacheServiceNumber).to.throw(SyntaxError)

      const createCacheServiceFunction = () => cacheService.createCacheService(() => {})
      expect(createCacheServiceFunction).to.throw(SyntaxError)

      const createCacheServiceDate = () => cacheService.createCacheService(new Date())
      expect(createCacheServiceDate).to.throw(SyntaxError)

      const createCacheService = () => cacheService.createCacheService({})
      expect(createCacheService).to.throw(SyntaxError)

      const onlyGetHandler = { get: () => {} }

      const createCacheServiceWithOnlyGetCacheHandler = () => cacheService.createCacheService(onlyGetHandler)

      expect(createCacheServiceWithOnlyGetCacheHandler).to.throw(SyntaxError)

      const getAndUpsertHandler = { get: () => {}, upsert: () => {} }

      const createCacheServiceWithGetAndUpsertCacheHandler = () =>
        cacheService.createCacheService(getAndUpsertHandler)

      expect(createCacheServiceWithGetAndUpsertCacheHandler).to.throw(SyntaxError)

      const getUpsertRemoveHandler = { get: () => {}, upsert: () => {}, remove: () => {} }

      expect(cacheService.createCacheService(getUpsertRemoveHandler)).to.be.a('object')
    })

    it('should create a cache store with a valid handler', () => {
      const mockCacheHandler = {
        get: () => {},
        upsert: () => {},
        remove: () => {},
        getOrCacheThat: () => {}
      }

      const cacheS = cacheService.createCacheService(mockCacheHandler)

      expect(cacheS).to.be.a('object')
      expect(cacheS)
        .to.have.property('get')
        .to.be.a('function')
      expect(cacheS)
        .to.have.property('upsert')
        .to.be.a('function')
      expect(cacheS)
        .to.have.property('remove')
        .to.be.a('function')
    })
  })

  describe('remove', () => {
    it('should call remove from cache handler', () => {
      const mockCacheHandler = {
        get: () => {},
        upsert: () => {},
        remove: (e) => {
          expect(e).to.equal('key')
        },
        getOrCacheThat: () => {}
      }

      const cacheS = cacheService.createCacheService(mockCacheHandler)

      expect(cacheS).to.be.a('object')
      expect(cacheS)
        .to.have.property('remove')
        .to.be.a('function')

      cacheS.remove('key')
    })
  })

  describe('get', () => {
    it('should call get from cache handler', () => {
      const mockCacheHandler = {
        get: (e) => {
          expect(e).to.equal('key')
          return Promise.resolve({ dtExpiracao: '' })
        },
        upsert: () => {},
        remove: () => {},
        getOrCacheThat: () => {}
      }

      const cacheS = cacheService.createCacheService(mockCacheHandler)

      expect(cacheS).to.be.a('object')
      expect(cacheS)
        .to.have.property('get')
        .to.be.a('function')

      cacheS.get('key')
    })

    it('should return null when a key is expired', async () => {
      const cacheS = cacheService.createCacheService(imch)
      await cacheS.upsert('minha_chave_123', 'oi', 1)

      const value = await cacheS.get('minha_chave_123')
      expect(value)
        .to.be.a('object')
        .to.have.property('data')
        .to.equal('oi')

      const promise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(cacheS.get('minha_chave_123'))
        }, 2000)
      })

      const newValue = await promise
      expect(newValue)
        .to.have.property('data')
        .to.equal(null)
    })
  })

  describe('upsert', () => {
    it('should call upsert from cache handler', () => {
      const mockCacheHandler = {
        get: () => {},
        upsert: (e) => {
          expect(e).to.equal('key')
        },
        remove: () => {},
        getOrCacheThat: () => {}
      }

      const cacheS = cacheService.createCacheService(mockCacheHandler)

      expect(cacheS).to.be.a('object')
      expect(cacheS)
        .to.have.property('upsert')
        .to.be.a('function')

      cacheS.upsert('key')
    })

    it('should return the same value with ttl in number and in string', async () => {
      const cacheS = cacheService.createCacheService(imch)
      await cacheS.upsert('minha_chave_1234', 'oi', 1000)

      const value = await cacheS.get('minha_chave_1234')
      expect(value)
        .to.be.a('object')
        .to.have.property('data')
        .to.equal('oi')

      await cacheS.upsert('minha_chave_1234', 'oi2', '1000')

      const value2 = await cacheS.get('minha_chave_1234')
      expect(value2)
        .to.be.a('object')
        .to.have.property('data')
        .to.equal('oi2')
    })
  })

  describe('getOrCacheThat', () => {
    it('should return a key already stored', async () => {
      const cacheS = cacheService.createCacheService(imch)
      await cacheS.upsert('minha_chave_12345', 'oi', 3600)

      const value = await cacheS.getOrCacheThat('minha_chave_12345', () => {})
      expect(value)
        .to.be.a('string')
        .to.equal('oi')
    })

    it('should execute the function to compute a new value and store it', async () => {
      const key = 'minha_chave_987'

      const cacheS = cacheService.createCacheService(imch)
      const value = await cacheS.getOrCacheThat(key, () => 'nova_computacao')

      expect(value)
        .to.be.a('string')
        .to.equal('nova_computacao')

      const value2 = await cacheS.getOrCacheThat(key, () => {})

      expect(value2)
        .to.be.a('string')
        .to.equal('nova_computacao')

      await cacheS.remove(key)
    })
  })
})
