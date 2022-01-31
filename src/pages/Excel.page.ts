import { Page } from '@core/page/Page'
import { Store } from '@core/store/Store'
import { rootReducer } from '@redux/rootReducer'
import { Excel } from '@components/excel-component/excel/Excel'
import { Formula } from '@components/excel-component/formula/Formula'
import { Table } from '@components/excel-component/table/Table'
import { Toolbar } from '@components/excel-component/toolbar/Toolbar'
import { Header } from '@components/excel-component/header/Header'
import { Dom } from '@core/framework/dom'
import { StateProcessor } from '@core/StateProcessor/StateProcessor'
import { LocalStorageClient } from '@core/StateProcessor/Clients/LocalStorage'

export class ExcelPage extends Page {
    private element: Excel
    private storeSubscribe: { unsubscribe: Function }
    protected readonly processor: StateProcessor = new StateProcessor(new LocalStorageClient(this.excelParams))

    constructor(params: any) {
        super(params)
    }

    get excelParams(): string {
        return this.params[1] || Date.now().toString()
    }

    async getRoot(): Promise<Dom> {
        const state = await this.processor.get()
        const store = new Store(rootReducer, state)

        this.storeSubscribe = store.subscribe(this.processor.listen)

        this.element = new Excel({
            components: [Header, Toolbar, Formula, Table],
            store
        })

        return this.element.getRoot()
    }

    afterRender(): void {
        this.element.init()
    }

    destroy(): void {
        this.storeSubscribe.unsubscribe()
        this.element.destroy()
    }
}
