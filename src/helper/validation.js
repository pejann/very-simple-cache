const isNil = (value) => value == null

const isObject = (value) => typeof value === 'object' && !Array.isArray(value)

const isDate = (value) => typeof value === 'object' && value instanceof Date

module.exports = { isNil, isObject, isDate }
