const { expect } = require('chai')
const { isNil } = require('../../../src/helper/validation')

describe('Validations', async () => {

    describe('isNil', () => {

        it('should return true if the value is null', () => {

            expect(isNil(null)).to.equal(true)

        })

        it('should return true if the value is undefined', () => {

            expect(isNil(undefined)).to.equal(true)
            expect(isNil()).to.equal(true)

        })

        it('should return false if the value is false', () => {

            expect(isNil(false)).to.equal(false)

        })

        it('should return false if the value is an empty string', () => {

            expect(isNil('')).to.equal(false)

        })
        it('should return false if the value is an empty object', () => {

            expect(isNil({})).to.equal(false)

        })

        it('should return false if the value is an empty array', () => {

            expect(isNil([])).to.equal(false)

        })

        it('should return false if the value is 0', () => {

            expect(isNil(0)).to.equal(false)

        })

        it('should return false if the value is a number', () => {

            expect(isNil(975)).to.equal(false)

        })

        it('should return false if the value is a string', () => {

            expect(isNil('string')).to.equal(false)

        })

        it('should return false if the value is a array', () => {

            expect(isNil([1, 2, 3])).to.equal(false)

        })
        it('should return false if the value is a object', () => {

            expect(isNil({ key: 'value' })).to.equal(false)

        })

    })

})
