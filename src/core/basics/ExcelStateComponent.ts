import { ExcelComponent } from '@core/basics/ExcelComponent'
import { Dom } from '@core/framework/dom'
import { ExcelOptions } from '@components/excel-component/excel/Excel.models'

export class ExcelStateComponent extends ExcelComponent {
    protected state: any

    get template(): string {
        return JSON.stringify(this.state, null, 2)
    }

    constructor(rootElement: Dom, options: ExcelOptions) {
        super(rootElement, options)
    }

    initState(state: any): void {
        this.state = { ...state }
    }

    setState(state: any): void {
        this.state = { ...this.state, ...state }
        this.rootElement.html(this.template)
    }
}
