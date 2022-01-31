export class EventEmitter {
    private listeners: { [key: string]: Array<Function> } = {}

    emit(event: string, ...args: any): void {
        if (!this.listeners[event]) {
            return
        }
        this.listeners[event].forEach((listener: any) => {
            listener(...args)
        })
    }

    subscribe(event: string, fn: Function): Function {
        this.listeners[event] = this.listeners[event] || []
        this.listeners[event].push(fn)
        return () => {
            this.listeners[event] = this.listeners[event].filter((listener) => listener !== fn)
        }
    }
}
