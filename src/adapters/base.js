const is = require('is')

const AdapterValidator = require('../validators/adapter')
const NotImplementedError = require('../errors/not_implemented')

class BaseAdapter {
  constructor() {
    this.validator = new AdapterValidator(this.defineValidation.bind(this))
  }

  static get FILTER_OPERATORS() {
    return ['=']
  }

  static get DEFAULT_FILTER_OPERATOR() {
    return '='
  }

  'filter:*'(/* builder, { field, operator, value } */) {
    throw new NotImplementedError()
  }

  sort(/* builder, { field, order } */) {
    throw new NotImplementedError()
  }

  page(/* builder, { size, number, offset } */) {
    throw new NotImplementedError()
  }

  defineValidation(/* schema */) {
    return undefined
  }

  filter(builder, filter) {
    const { operator } = filter
    const operatorMethod = `filter:${operator}`

    if (is.fn(this[operatorMethod])) {
      return this[operatorMethod](builder, filter)
    }

    if (this.constructor.FILTER_OPERATORS.includes(operator)) {
      return this['filter:*'](builder, filter)
    }

    throw new NotImplementedError()
  }
}

module.exports = BaseAdapter
