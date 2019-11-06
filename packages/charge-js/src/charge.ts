/**
 * charge
 */

/**
 * Module Dependencies
 */

import Emitter from 'events'
import util from 'url'
import Stream from 'stream'


/**
 * Emitt `Application` Class.
 * Inherits from `Emitter.prototype`.
 */
export default class Application extends Emitter {
  /**
   * Initialize new `Application`
   * @api public
   */
  env = undefined

  /**
   * @param {object} [options] Application options
   * @param {string} [options.env='development'] Application Environment
   */
  constructor(options) {
    super()
    options = options || {}
    this.env = options.env || process.env.NODE_ENV || 'development'
  }
}

