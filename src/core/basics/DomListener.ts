import { Dom } from '@core/framework/dom'
import { capitalize } from '@core/utils'

export class DomListener {
    protected name: string

    constructor(protected readonly rootElement: Dom, protected readonly listeners: string[] = []) {
        if (!rootElement) {
            throw new Error('No rootElement provided for DomListener!')
        }
    }

    initDOMListeners(): void {
        this.listeners.forEach((listener) => {
            const method = getMethodName(listener)
            // @ts-ignore
            if (!this[method]) {
                throw new Error(`Method ${method} is not implemented in ${this.name} Component`)
            }
            // @ts-ignore
            this[method] = this[method]?.bind(this)
            // @ts-ignore
            this.rootElement.on(listener, this[method])
        })
    }

    removeDOMListeners(): void {
        this.listeners.forEach((listener) => {
            const method = getMethodName(listener)
            // @ts-ignore
            this.rootElement.off(listener, this[method])
        })
    }
}

function getMethodName(event: string): string {
    return 'on' + capitalize(event)
}
