import { Store } from '@core/store/Store'
import { EventEmitter } from '@core/RxJs/EventEmitter'

export interface AppExcelOptions {
    components: any[] // Компоненты Excel
    store: Store // Instance redux
}

export interface ExcelComponentOptions {
    emitter: EventEmitter // Instance EventEmitter
    store: Store // Instance redux
}

export interface ExcelOptions extends ExcelComponentOptions {
    name: string // Имя компонента
    listeners?: string[] // События компонента
    stateSubscribes?: string[] // Подписки на state (redux)
}
