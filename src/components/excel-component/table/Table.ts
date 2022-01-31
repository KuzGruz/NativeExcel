import { ExcelComponent } from '@core/basics/ExcelComponent'
import { TableBuilder } from '@components/excel-component/table/TableBuilder'
import { Dom, dom } from '@core/framework/dom'
import { resizeHandler, doubleClickResizeHandler, cellSelection } from '@components/excel-component/table/table.utils'
import { TableSelection } from '@components/excel-component/table/TableSelection'
import * as actions from '@redux/redux.actions'
import { DEFAULT_STYLES } from '@components/excel-component/toolbar/Toolbar.models'
import { parse } from '@core/utils'
import { ExcelComponentOptions } from '@components/excel-component/excel/Excel.models'

const enum KeyControl {
    up = 'ArrowUp',
    down = 'ArrowDown',
    left = 'ArrowLeft',
    right = 'ArrowRight',
    esc = 'Escape',
    tab = 'Tab',
    enter = 'Enter',
    delete = 'Delete'
}

export class Table extends ExcelComponent {
    static className = 'excel__table'
    private table: TableBuilder
    private selection = new TableSelection(this.rootElement)

    constructor(rootElement: Dom, options: ExcelComponentOptions) {
        super(rootElement, {
            name: 'Table',
            listeners: ['mousedown', 'dblclick', 'keydown', 'input'],
            ...options
        })
        this.table = new TableBuilder(null, options.store.getState())
    }

    init(): void {
        super.init()
        const focusedElement = this.rootElement.find('[data-id="1:1"]')
        this.selection.startSelection(focusedElement)
        this.emitSelectCell()
        this.initSubscriptions()
    }

    toHTML(): string {
        this.table.init()
        return this.table.template
    }

    onMousedown(event: MouseEvent): void {
        const target = dom(event.target as HTMLElement)
        const resizeElement = target?.parent('[data-resize]')
        if (resizeElement?.element) {
            this.resizeTable(this.rootElement, resizeElement, event)
        }
        if (target.hasData('data')) {
            cellSelection(this.rootElement, this.selection, target, event)
            this.emitSelectCell()
        }
    }

    onInput(event: InputEvent): void {
        const element = dom(event.target as HTMLElement)
        const text = element.text
        element.addAttr('data-value', text)
        this.updateTextInStore(text)
    }

    onDblclick(event: MouseEvent): void {
        const resizer = dom(event.target as HTMLElement)?.parent('[data-resize]')
        if (resizer?.element) {
            doubleClickResizeHandler(this.rootElement, resizer, event)
        }
    }

    onKeydown(event: KeyboardEvent): void {
        switch (event.code) {
            case KeyControl.down:
            case KeyControl.enter:
                event.preventDefault()
                this.selection.move(0, 1)
                break
            case KeyControl.up:
                this.selection.move(0, -1)
                break
            case KeyControl.left:
                this.selection.move(-1, 0)
                break
            case KeyControl.right:
            case KeyControl.tab:
                event.preventDefault()
                this.selection.move(1, 0)
                break
            case KeyControl.esc:
                this.selection.escape()
                break
        }
        this.emitSelectCell()
    }

    private async resizeTable(rootElement: Dom, resizeElement: Dom, event: MouseEvent): Promise<void> {
        try {
            const data = await resizeHandler(rootElement, resizeElement, event)
            this.$dispatch(actions.tableResize(data))
        } catch (e) {
            console.warn('Resize error:', e.message)
        }
    }

    private initSubscriptions(): void {
        this.$on('formula:input', (text: any) => {
            this.selection.currentElement?.addAttr('data-value', text)
            this.selection.setText(parse(text))
            this.updateTextInStore(text)
        })

        this.$on('formula:keydown:enter', () => {
            this.selection.startSelection(this.selection.currentElement as Dom)
        })

        this.$on('toolbar:style', (style: any) => {
            this.selection.setStyle(style)
            this.$dispatch(actions.applyStyle({ value: style, id: this.selection.ids }))
        })
    }

    private updateTextInStore(text: string): void {
        this.$dispatch(
            actions.changeText({
                id: this.selection.currentElement?.getDataAttr('id'),
                value: text
            })
        )
    }

    private emitSelectCell(): void {
        setTimeout(() => {
            this.$emit('table:select', this.selection.currentElement?.dataset?.value || '')
            const styles = this.selection.currentElement?.getCss(Object.keys(DEFAULT_STYLES))
            this.$dispatch(actions.changeStyles(styles))
        }, 0)
    }
}
