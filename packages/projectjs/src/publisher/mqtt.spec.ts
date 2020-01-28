import {_detectStatusChange} from './mqtt'

describe('MQTT Publisher', () => {
    describe('Detect Status Change', () => {
        it('detects state change', () => {
            const old = { plug: 1, state: 1 }
            const newStat = { plug: 1, state: 2 }
            const change = _detectStatusChange(old, newStat)
            expect(change).toBeTruthy()
        })
    })
})