const { expect } = require('chai')
const { isDate } = require('../../../src/helper/validation')

describe('Validations', async () => {
    describe('isDate', () => {
        it('should return true if the value is a date', () => {
            expect(isDate(new Date())).to.equal(true)
        })

        it('should return false if the value is a object', () => {
            expect(isDate({})).to.equal(false)
        })

        it('should return false if the value is a array', () => {
            expect(isDate([])).to.equal(false)
        })

        it('should return false if the value is a string', () => {
            expect(isDate('')).to.equal(false)
        })

        it('should return false if the value is a number', () => {
            expect(isDate(10)).to.equal(false)
        })
    })
})
