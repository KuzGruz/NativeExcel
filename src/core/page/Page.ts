import { Dom } from '@core/framework/dom'

export class Page {
    constructor(protected readonly params: any) {}

    async getRoot(): Promise<string | Dom> {
        throw new Error('Method getRoot should be implemented')
    }

    afterRender(): void {}

    destroy(): void {}
}
