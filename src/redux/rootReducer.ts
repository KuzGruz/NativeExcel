import { StoreAction, StoreState } from '@core/store/Store'
import { APPLY_STYLE, CHANGE_STYLES, CHANGE_TEXT, CHANGE_TITLE, INIT_TABLE, TABLE_RESIZE } from '@redux/redux.models'

export function rootReducer(state: StoreState, action: StoreAction): StoreState {
    switch (action.type) {
        case INIT_TABLE:
            return { ...state, modified: action.payload as string }
        case TABLE_RESIZE:
            return { ...state, sizeState: value(state, 'sizeState', action) }
        case CHANGE_TEXT:
            return { ...state, formulaState: action.payload.value, cellsState: value(state, 'cellsState', action) }
        case CHANGE_STYLES:
            return { ...state, currentStylesState: action.payload }
        case CHANGE_TITLE:
            return { ...state, tableTitleState: action.payload.value }
        case APPLY_STYLE:
            const stylesState = state.stylesState || {}
            action.payload.id.forEach((id: any) => {
                stylesState[id] = { ...(stylesState[id] as {}), ...action.payload.value }
            })
            return {
                ...state,
                stylesState: stylesState,
                currentStylesState: { ...state.currentStylesState, ...action.payload.value }
            }
        default:
            return state
    }
}

function value(state: StoreState, field: keyof StoreState, action: StoreAction): { [key: string]: number } {
    const val = state[field] || {}
    val[action.payload.id] = action.payload.value
    return val
}
