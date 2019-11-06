import Charge from '../charge'
import 'mocha'
import {expect} from 'chai'

describe('Charge()', () => {
  it('should init the App with default values', () => {
    const app = new Charge({})
    expect(app).to.equal(app)
  })
})

