const { expect } = require('chai')
const { createCacheDataByTtlInSeconds } = require('../../../src/helper/cache-data')
const { now } = require('../../../src/helper/time')

describe('Cache Data', async () => {
    describe('createCacheDataByTtlInSeconds', () => {
        it('should create a CacheData object with the parameters passed', () => {
            const cacheData = createCacheDataByTtlInSeconds('minha_chave', 'oi', 3600)
            const current = now()

            expect(cacheData)
                .to.be.a('object')
                .to.have.property('key')
                .to.equal('minha_chave')

            expect(cacheData)
                .to.be.a('object')
                .to.have.property('data')
                .to.equal('oi')

            expect(cacheData)
                .to.be.a('object')
                .to.have.property('secondsToExpire')
                .to.equal(3600)

            expect(cacheData)
                .to.be.a('object')
                .to.have.property('unixExpirationDate')
                .to.equal(current + 3600)
        })
    })
})
