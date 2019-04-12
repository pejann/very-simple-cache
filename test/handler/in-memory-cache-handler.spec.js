const { expect } = require('chai')
const imch = require('../../src/handler/in-memory-cache.handler')

const getNow = () => Math.round(new Date().getTime() / 1000)

describe('In Memory Cache Handler', async () => {
  const ttlNextHour = getNow() + 3600

  describe('get', () => {
    it('should return a promise with null when there is nothing with that key in storage', () => {
      const value = imch.get('minha_chave')
      expect(value).to.be.a('Promise')
    })

    it('should return null when there is no value bounded to the key', async () => {
      const value = await imch.get('minha_chave')
      expect(value).to.be.a('object')
        .to.have.property('data')
        .to.equal(null)
    })

    it('should return a value from the storage when the key exists', async () => {
      await imch.upsert('chave', 'meu_valor', ttlNextHour)
      const value = await imch.get('chave')

      expect(value).to.have.property('data')
        .to.equal('meu_valor')
    })

    it('should return a value an upsert done before this execution', async () => {
      const value = await imch.get('chave')

      expect(value).to.have.property('data')
        .to.equal('meu_valor')
    })

    it('should return an object with specific properties', async () => {
      const value = await imch.get('chave')

      expect(value).to.have.property('data')
      expect(value).to.have.property('unixExpirationDate')
        .to.be.a('number')
      expect(value).to.have.property('key')
        .to.be.a('string')
    })

    /**
         * The cacheService is responsible to invalidate a cache, so this
         * functionality remains working for the handler
         */
    it('should return the object even when the key is already expired', (done) => {
      const ttlNextHalfSecond = getNow() + 30 // Adiciona 30s

      const objectToInsert = { theAnswer: 42 }

      imch.upsert('minha_nova_chave', objectToInsert, ttlNextHalfSecond)
        .then(_ => {
          setTimeout(async () => {
            const value = await imch.get('minha_nova_chave')
            expect(value).to.have.property('data')
              .to.have.property('theAnswer')
              .to.equal(42)
            done()
          }, 700)
        })
    })
  })

  describe('upsert', () => {
    it('should insert a value in the memory cache storage', async () => {
      const objectToInsert = { theAnswer: 42 }

      await imch.upsert('minha_nova_chave', objectToInsert, ttlNextHour)
      const value = await imch.get('minha_nova_chave')

      expect(value).to.have.property('data')
        .to.have.property('theAnswer')
        .to.equal(42)
    })

    it('should replace a value in the memory cache storage when the key exists', async () => {
      const objectToInsert = { theAnswer: 42 }

      await imch.upsert('minha_nova_chave', objectToInsert, ttlNextHour)
      const value = await imch.get('minha_nova_chave')

      expect(value).to.have.property('data')
        .to.have.property('theAnswer')
        .to.equal(42)

      const objectToReplace = { theAnswer: 43 }

      await imch.upsert('minha_nova_chave', objectToReplace, ttlNextHour)
      const newValue = await imch.get('minha_nova_chave')

      expect(newValue).to.have.property('data')
        .to.have.property('theAnswer')
        .to.equal(43)
    })
  })

  describe('remove', () => {
    it('should remove a key from the cache and should return null after a lookup', async () => {
      const objectToInsert = { theAnswer: 42 }

      await imch.upsert('minha_nova_chave', objectToInsert, ttlNextHour)
      const value = await imch.get('minha_nova_chave')

      expect(value).to.have.property('data')
        .to.have.property('theAnswer')
        .to.equal(42)

      await imch.remove('minha_nova_chave')

      const newValue = await imch.get('minha_nova_chave')
      expect(newValue).to.be.a('object')
        .to.have.property('data')
        .to.equal(null)
    })

    it('should return true when trying to delete a key that does not exists', async () => {
      const removed = await imch.remove('minha_nova_chave2')
      expect(removed).to.equal(true)

      const newValue = await imch.get('minha_nova_chave2')
      expect(newValue).to.be.a('object')
        .to.have.property('data')
        .to.equal(null)
    })
  })

  describe('flush', () => {
    it('should remove all the keys in the storage', async () => {
      const objectToInsert = { theAnswer: 42 }

      await imch.upsert('minha_nova_chave', objectToInsert, ttlNextHour)

      const value = await imch.get('minha_nova_chave')
      expect(value).to.have.property('data')
        .to.have.property('theAnswer')
        .to.equal(42)

      const flushed = await imch.flush()
      expect(flushed).to.equal(true)

      const afterFlushValue = await imch.get('minha_nova_chave')
      expect(afterFlushValue).to.be.a('object')
        .to.have.property('data')
        .to.equal(null)
    })
  })
})
