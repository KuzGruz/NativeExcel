import { StoreState } from '@core/store/Store'
import { DEFAULT_TABLE_TITLE } from '@components/excel-component/header/Header.models'
import { DEFAULT_STYLES } from '@components/excel-component/toolbar/Toolbar.models'

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export const DEFAULT_STATES: StoreState = {
    sizeState: {},
    rowState: {},
    cellsState: {},
    formulaState: '',
    stylesState: {},
    currentStylesState: DEFAULT_STYLES,
    tableTitleState: DEFAULT_TABLE_TITLE,
    modified: 0
}

export function storage(key: string, data?: any): any {
    if (!data) {
        return JSON.parse(<string>localStorage.getItem(key)) || deepCopy(DEFAULT_STATES)
    } else {
        localStorage.setItem(key, JSON.stringify(data))
    }
}

export function removeStorage(key: string): void {
    localStorage.removeItem(key)
}

export function isEqual(previous: any, current: any): boolean {
    if (typeof previous === 'object' && typeof current === 'object') {
        return JSON.stringify(previous) === JSON.stringify(current)
    }
    return previous === current
}

export function camelToDashCase(str: string): string {
    return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`)
}

export function toInlineStyles(styles: { [key: string]: string }): string {
    return Object.keys(styles)
        .map((key) => `${camelToDashCase(key)}: ${styles[key]}`)
        .join('; ')
}

export function debounce(fn: Function, time: number): (...args: any) => void {
    let timeout: any
    return function (...args) {
        const later = () => {
            clearTimeout(timeout)
            // @ts-ignore
            fn.apply(this, args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, time)
    }
}

export function parse(str: string): string {
    if (str.startsWith('=')) {
        try {
            return eval(str.slice(1))
        } catch (e) {
            return str
        }
    }
    return str
}

export function dateFormat(date: Date, format: string): string {
    const month = date.toLocaleString('en', { month: 'short' })
    const monthFull = date.toLocaleString('en', { month: 'long' })
    const year = date.getFullYear().toString()
    const week = date.toLocaleString('en', { weekday: 'long' })
    const day = date.getDate().toString()
    const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours().toString()
    const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds().toString()
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes().toString()
    return String(format)
        .replace('MMM', monthFull)
        .replace('MM', month)
        .replace('yyyy', year)
        .replace('ww', week)
        .replace('dd', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('SS', seconds)
}

export function deepCopy(obj: Object): Object {
    return JSON.parse(JSON.stringify(obj))
}
