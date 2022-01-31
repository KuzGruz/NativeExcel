import { storage } from '@core/utils'
import { Client } from '@core/StateProcessor/Clients/Clients.models'

export class LocalStorageClient implements Client {
    constructor(private readonly name: string) {
        this.name = `excel:${this.name}`
    }

    save(state: any): Promise<any> {
        storage(this.name, state)
        return Promise.resolve('Success')
    }

    get(): Promise<any> {
        // return Promise.resolve(storage(this.name))
        return new Promise((resolve) => {
            setTimeout(() => resolve(storage(this.name)), 2500)
        })
    }
}
