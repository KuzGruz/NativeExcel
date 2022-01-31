import * as actions from '@redux/redux.actions'

export type StoreCallback = (state: StoreState) => void

export interface StoreState {
    sizeState?: { [key: string]: number }
    rowState?: { [key: string]: number }
    cellsState?: { [key: string]: number | string }
    formulaState?: any
    currentStylesState?: { [key: string]: number | string }
    stylesState?: { [key: string]: number | string }
    tableTitleState: string
    modified: string | number | Date
}

export interface StoreAction {
    type: string
    payload: { id?: any; value?: any }
}

export class Store {
    private listeners: StoreCallback[] = []
    private state: StoreState

    constructor(private readonly rootReducer: Function, initialState: StoreState) {
        this.state = this.rootReducer(initialState, actions.initTable(Date.now().toString()))
    }

    subscribe(fn: StoreCallback): { unsubscribe: Function } {
        this.listeners.push(fn)
        return {
            unsubscribe: () => {
                this.listeners = this.listeners.filter((func: StoreCallback) => func !== fn)
            }
        }
    }

    dispatch(action: StoreAction) {
        this.state = this.rootReducer(this.state, action)
        this.listeners.forEach((listener: StoreCallback) => listener(this.state))
    }

    getState(): StoreState {
        return { ...this.state }
    }
}
