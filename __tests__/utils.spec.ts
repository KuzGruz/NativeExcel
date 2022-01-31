import { capitalize } from '@core/utils'

describe('Utils.ts functions', () => {
    test('should capitalize function name', () => {
        expect(capitalize('click')).toBe('Click')
    })
})
