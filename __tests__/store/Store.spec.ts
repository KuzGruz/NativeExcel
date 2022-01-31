import { Store, StoreAction, StoreCallback, StoreState } from '@core/store/Store'
import { DEFAULT_STATES } from '@core/utils'
import { CHANGE_TITLE } from '@redux/redux.models'

describe('Store', () => {
    let store: Store
    let handler: StoreCallback
    let mockReducer: Function

    jest.enableAutomock()

    beforeEach(() => {
        mockReducer = jest.fn((state: StoreState, action: StoreAction) => {
            switch (action.type) {
                case CHANGE_TITLE:
                    return { ...state, tableTitleState: action.payload.value }
                default:
                    return state
            }
        })
        handler = jest.fn()
        store = new Store(mockReducer, { ...DEFAULT_STATES })
    })

    test('should create instance', () => {
        expect(store).toBeDefined()
        expect(store.getState).toBeDefined()
        expect(store.subscribe).toBeDefined()
        expect(store.dispatch).toBeDefined()
    })

    test('should return state', () => {
        expect(store.getState()).toBeInstanceOf(Object)
        expect(store.getState()).toEqual(DEFAULT_STATES)
    })

    test('should change state of action exist', () => {
        store.dispatch({ type: CHANGE_TITLE, payload: { value: 'test' } })
        expect(mockReducer).toBeCalledTimes(2)
        expect(store.getState().tableTitleState).toBe('test')
    })

    test('should NOT change state of action exist', () => {
        store.dispatch({ type: 'CHANGE_TITLE_FAKE', payload: { value: 'test' } })
        expect(mockReducer).toBeCalled()
        expect(store.getState()).toStrictEqual(DEFAULT_STATES)
    })

    test('should call subscribe function', () => {
        store.subscribe(handler)
        store.dispatch({ type: CHANGE_TITLE, payload: { value: 'test' } })
        expect(handler).toHaveBeenCalled()
        expect(handler).toHaveBeenCalledWith(store.getState())
    })

    test('should NOT call if unsubscribe', () => {
        const sub = store.subscribe(handler)
        sub.unsubscribe()
        store.dispatch({ type: CHANGE_TITLE, payload: { value: 'test' } })
        expect(handler).not.toHaveBeenCalled()
    })

    test('should dispatch in async way', () => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                store.dispatch({ type: CHANGE_TITLE, payload: { value: 'test' } })
            }, 500)

            setTimeout(() => {
                expect(store.getState().tableTitleState).toBe('test')
                resolve()
            }, 1000)
        })
    })
})
