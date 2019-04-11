const { expect } = require('chai')
const { createCacheDataByUnixTimestamp } = require('../../../src/helper/cache-data')
const { now } = require('../../../src/helper/time')

describe('Cache Data', async () => {

    describe('createCacheDataByUnixTimestamp', () => {

        it('should create a CacheData object with the parameters passed', () => {

            const current = now()

            const cacheData = createCacheDataByUnixTimestamp(
                'minha_chave', 'oi', current + 3600)

            expect(cacheData).to.be.a('object')
                .to.have.property('key')
                .to.equal('minha_chave')

            expect(cacheData).to.be.a('object')
                .to.have.property('data')
                .to.equal('oi')

            expect(cacheData).to.be.a('object')
                .to.have.property('secondsToExpire')
                .to.equal(3600)

            expect(cacheData).to.be.a('object')
                .to.have.property('unixExpirationDate')
                .to.equal(current + 3600)

        })

    })

})
