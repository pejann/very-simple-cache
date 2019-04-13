const { expect } = require('chai')
const { isObject } = require('../../../src/helper/validation')

describe('Validations', async () => {
  describe('isObject', () => {
    it('should return true if the value is an object', () => {
      expect(isObject({ id: 1, name: 'Name' })).to.equal(true)
    })

    it('should return true if the value is an empty object', () => {
      expect(isObject({})).to.equal(true)
    })

    it('should return false if the value is an empty array', () => {
      expect(isObject([])).to.equal(false)
    })

    it('should return false if the value is an array', () => {
      expect(isObject([1, '2', 2.5])).to.equal(false)
    })

    it('should return false if the value is a string', () => {
      expect(isObject('string')).to.equal(false)
    })

    it('should return false if the value is a number', () => {
      expect(isObject(1)).to.equal(false)
    })

    it('should return true if the value is a date', () => {
      expect(isObject(new Date())).to.equal(true)
    })

    it('should return true if the value is a set', () => {
      expect(isObject(new Set())).to.equal(true)
    })
  })
})
