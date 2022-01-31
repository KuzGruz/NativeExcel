import { Store, StoreState } from '@core/store/Store'
import { isEqual } from '@core/utils'

export class StoreSubscriber {
    private sub: any
    private state: StoreState

    constructor(private readonly store: Store) {}

    subscribe(components: any[]): void {
        this.state = this.store.getState()
        this.sub = this.store.subscribe((state: StoreState) => {
            Object.keys(state).forEach((key) => {
                // @ts-ignore
                if (!isEqual(this.state[key], state[key])) {
                    components.forEach((component) => {
                        if (component.isWatching(key)) {
                            // @ts-ignore
                            const changes = { [key]: state[key] }
                            if (!component.storeChanged) {
                                throw new Error(`Should implement method storeChanged in ${component.name} component`)
                            } else {
                                component.storeChanged(changes)
                            }
                        }
                    })
                }
            })
            this.state = this.store.getState()
        })
    }

    unsubscribe(): void {
        this.sub.unsubscribe()
    }
}
