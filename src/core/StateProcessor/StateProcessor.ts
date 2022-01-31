import { debounce } from '@core/utils'

export class StateProcessor {
    constructor(protected readonly client: any, delay = 300) {
        this.listen = debounce(this.listen.bind(this), delay)
    }

    listen(state: any): any {
        this.client.save(state)
    }

    get(): any {
        return this.client.get()
    }
}
