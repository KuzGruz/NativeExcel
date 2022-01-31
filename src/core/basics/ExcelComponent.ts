import { DomListener } from '@core/basics/DomListener'
import { Dom } from '@core/framework/dom'
import { EventEmitter } from '@core/RxJs/EventEmitter'
import { Store, StoreAction } from '@core/store/Store'
import { ExcelOptions } from '@components/excel-component/excel/Excel.models'

export class ExcelComponent extends DomListener {
    protected readonly emitter: EventEmitter
    protected readonly stateSubscribes: any[]
    protected readonly store: Store
    protected readonly unsubscription: Function[] = []

    constructor(rootElement: Dom, options: ExcelOptions) {
        super(rootElement, options.listeners)
        this.emitter = options.emitter
        this.store = options.store
        this.name = options.name
        this.stateSubscribes = options?.stateSubscribes || []
        this.prepare()
    }

    prepare(): void {}

    init(): void {
        this.initDOMListeners()
    }

    toHTML(): string {
        throw new Error('Implement the method: toHTML!')
    }

    $emit(event: string, ...args: any): void {
        this.emitter?.emit(event, ...args)
    }

    $on(event: string, fn: Function): void {
        this.unsubscription.push(this.emitter?.subscribe(event, fn))
    }

    isWatching(key: any): boolean {
        return this.stateSubscribes.includes(key)
    }

    $dispatch(actions: StoreAction): void {
        this.store?.dispatch(actions)
    }

    destroy(): void {
        this.removeDOMListeners()
        this.unsubscription.forEach((unsub) => unsub())
    }
}
