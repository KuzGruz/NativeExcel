import { dom, Dom } from '@core/framework/dom'
import { ToolbarBuilder } from '@components/excel-component/toolbar/ToolbarBuilder'
import { ExcelStateComponent } from '@core/basics/ExcelStateComponent'
import { DEFAULT_STYLES } from '@components/excel-component/toolbar/Toolbar.models'
import { ExcelComponentOptions } from '@components/excel-component/excel/Excel.models'

export class Toolbar extends ExcelStateComponent {
    static className = 'toolbar'
    private readonly toolbarBuilder = new ToolbarBuilder()

    get template(): string {
        return this.toolbarBuilder.template(this.state)
    }

    constructor(rootElement: Dom, options: ExcelComponentOptions) {
        super(rootElement, {
            name: 'Toolbar',
            listeners: ['click'],
            stateSubscribes: ['currentStylesState'],
            ...options
        })
    }

    prepare(): void {
        this.initState(DEFAULT_STYLES)
    }

    toHTML(): string {
        return this.template
    }

    storeChanged(changes: any): void {
        this.setState(changes.currentStylesState)
    }

    onClick(event: MouseEvent): void {
        const target = dom(event.target as HTMLElement)
        const parent = target.parent('[data-toolbar-button]')
        if (parent.element) {
            const value = JSON.parse(<string>parent.dataset.style)
            this.$emit('toolbar:style', value)
            const key = Object.keys(value)[0]
            this.setState({ [key]: value[key] })
        }
    }
}
