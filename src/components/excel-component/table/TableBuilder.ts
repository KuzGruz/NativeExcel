import { StoreState } from '@core/store/Store'
import { DEFAULT_STYLES } from '@components/excel-component/toolbar/Toolbar.models'
import { parse, toInlineStyles } from '@core/utils'

export interface tableSize {
    rows?: number
    columns?: number
}

export class TableBuilder {
    columns: number
    rows: number
    template: string

    static tableState: StoreState | undefined
    static rowsHeight = 24
    static cellInfoWidth = 45
    static cellDataWidth = 120
    static codes = {
        start: 65,
        end: 90
    }
    static alphabetPower = TableBuilder.codes.end - TableBuilder.codes.start + 1

    constructor(options?: tableSize | null, readonly state?: StoreState) {
        TableBuilder.tableState = state
        if (options?.rows) {
            this.rows = options.rows
        } else {
            this.rows = TableBuilder.calculateMaxRowsPerWindow()
        }
        if (options?.columns) {
            this.columns = options.columns
        } else {
            this.columns = TableBuilder.calculateMaxColumnsPerWindow()
        }
    }

    init(): void {
        const template: string[] = []
        template.push(this.createHeaderRow())
        for (let i = 0; i < this.rows; i++) {
            template.push(this.createTableRow(i + 1))
        }
        this.template = template.join('')
    }

    private createHeaderRow(): string {
        const row = new Array(this.columns).fill('').map(TableBuilder.cellInfoTemplate).join('')

        return TableBuilder.rowTemplate(0, row)
    }

    private createTableRow(index: number, cell = ''): string {
        const row = new Array(this.columns).fill(cell).map(TableBuilder.cellDataTemplateWithRowIndex(index)).join('')

        return TableBuilder.rowTemplate(index, row)
    }

    static cellInfoTemplate(data: string | number, index: number): string {
        return TableBuilder.cellTemplate(data, index, false)
    }

    static cellDataTemplateWithRowIndex(rowIndex: number): any {
        return function (data: string | number, index: number): string {
            return TableBuilder.cellTemplate(data, index, true, rowIndex)
        }
    }

    static cellDataTemplate(data: string | number, index: number): string {
        return TableBuilder.cellTemplate(data, index, true)
    }

    static cellTemplate(data: string | number, index: number, isDataCell: boolean, rowIndex?: number): string {
        const idx = TableBuilder.indexToChar(index)
        const cellId = `${index + 1}:${rowIndex}`
        const styleState = (TableBuilder?.tableState?.stylesState?.[cellId] as unknown) as { [key: string]: string }
        const styles = styleState ? toInlineStyles(styleState) : toInlineStyles(DEFAULT_STYLES)
        data = (TableBuilder.tableState?.cellsState?.[cellId] || data).toString()
        const width = TableBuilder.setTableElementSize(idx, true)
        return `<div class='cell cell-${isDataCell ? 'data' : 'info'}'
                    data-resizeable='col'
                    data-index='${idx}'
                    style='${styles}; width: ${width}'
                    ${isDataCell ? 'data-data contenteditable="true"' : ''}
                    ${data ? `data-value="${data}"` : ''}
                    ${rowIndex ? `data-id="${cellId}"` : ''}>
                    ${isDataCell ? parse(data) : idx}
                    ${isDataCell ? '' : TableBuilder.resizeTemplate()}
                </div>`
    }

    static rowTemplate(index: number, cells: string): string {
        const width = TableBuilder.setTableElementSize(index)
        return `
              <div class='row' data-resizeable='row' data-index='${index}' style='height: ${width}'>
                  <div class='row-info'>
                    ${index ? index : ''}
                    ${index ? TableBuilder.resizeTemplate() : ''}
                  </div>
                  <div class='row-data'>${cells}</div>
              </div>
            `
    }

    static resizeTemplate(): string {
        return `
              <div class='resize' data-resize>
                 <div class='resize-line'></div>
              </div>
            `
    }

    private static indexToChar(index: number): string {
        const depth = TableBuilder.checkDepth(index)
        if (depth === 1) {
            return TableBuilder.charConverter(index)
        } else {
            const result = []
            for (let step = 1; step < depth; step++) {
                const temp = Math.pow(TableBuilder.alphabetPower, depth - step)
                const multiplier = Math.trunc(index / temp)
                index = index - multiplier * temp
                result.push(multiplier - 1)
            }
            return result.map((idx) => TableBuilder.indexToChar(idx)).join('')
        }
    }

    private static checkDepth(index: number): number {
        let depth = 1
        let border = TableBuilder.alphabetPower
        while (index / border >= 1) {
            depth++
            border += Math.pow(TableBuilder.alphabetPower, depth)
        }
        return depth
    }

    private static charConverter(index: number): string {
        return String.fromCharCode(TableBuilder.codes.start + index)
    }

    private static calculateMaxRowsPerWindow(): number {
        return Math.ceil(
            (window.innerHeight - (TableBuilder.cellDataWidth + TableBuilder.rowsHeight)) / TableBuilder.rowsHeight
        )
    }

    private static calculateMaxColumnsPerWindow(): number {
        return Math.ceil((window.innerWidth - TableBuilder.cellInfoWidth) / TableBuilder.cellDataWidth)
    }

    private static setTableElementSize(index: string | number, isColumn?: boolean): string {
        const defaultSize = isColumn ? TableBuilder.cellDataWidth : TableBuilder.rowsHeight
        return (
            (TableBuilder.tableState?.sizeState?.[index] ? TableBuilder.tableState?.sizeState[index] : defaultSize) +
            'px'
        )
    }
}
