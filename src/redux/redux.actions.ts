import { APPLY_STYLE, CHANGE_STYLES, CHANGE_TEXT, CHANGE_TITLE, INIT_TABLE, TABLE_RESIZE } from '@redux/redux.models'
import { StoreAction } from '@core/store/Store'

export function tableResize(data: any): StoreAction {
    return { type: TABLE_RESIZE, payload: data }
}

export function changeText(data: any): StoreAction {
    return { type: CHANGE_TEXT, payload: data }
}

export function changeStyles(data: any): StoreAction {
    return { type: CHANGE_STYLES, payload: data }
}

export function applyStyle(data: any): StoreAction {
    return { type: APPLY_STYLE, payload: data }
}

export function changeTableTitle(data: any): StoreAction {
    return { type: CHANGE_TITLE, payload: data }
}

export function initTable(data: any): StoreAction {
    return { type: INIT_TABLE, payload: data }
}
