const { expect } = require('chai')
const { blankCacheData } = require('../../../src/helper/cache-data')

describe('Cache Data', async () => {
  describe('blankCacheData', () => {
    it('should return a blank CacheData-like object', () => {
      expect(blankCacheData())
        .to.be.a('object')
        .to.have.property('unixExpirationDate')
        .to.equal(null)

      expect(blankCacheData())
        .to.be.a('object')
        .to.have.property('secondsToExpire')
        .to.equal(null)

      expect(blankCacheData())
        .to.be.a('object')
        .to.have.property('key')
        .to.equal(null)

      expect(blankCacheData())
        .to.be.a('object')
        .to.have.property('data')
        .to.equal(null)
    })
  })
})
