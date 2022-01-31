import { Dom } from '@core/framework/dom'

interface CellPosition {
    row: number
    column: number
}

export class TableSelection {
    private group: Dom[] = []
    private className = 'selected'

    currentElement: Dom | undefined

    get id(): string {
        return this.currentElement?.dataset.id as string
    }

    get ids(): string[] {
        return this.group.map((item) => item.dataset.id as string)
    }

    constructor(private readonly rootElement: Dom) {}

    startSelection(element: Dom, ctrl = false): void {
        this.currentElement = element
        this.select(element, ctrl)
    }

    endSelection(element: Dom): void {
        if (this.currentElement && this.currentElement?.element !== element.element) {
            const start = this.getElementPosition(this.currentElement)
            const end = this.getElementPosition(element)
            const group = this.getSelectedGroup(start, end)
            group.forEach((element) => element.addClass(this.className))
            this.group.push(...group)
        }
    }

    move(x: number, y: number): void {
        if (this.currentElement) {
            const position = this.getElementPosition(this.currentElement)
            const target: Dom = this.getElementByPosition({
                column: position.column + x > 1 ? position.column + x : 1,
                row: position.row + y > 1 ? position.row + y : 1
            })
            if (target.element) {
                this.startSelection(target)
            }
        }
    }

    reset(): void {
        this.group.forEach((element) => element.removeClass(this.className))
        this.group = []
        this.currentElement?.blur()
    }

    setText(text: string): void {
        if (this.currentElement) {
            this.currentElement.text = text
        }
    }

    setStyle(style: any): void {
        this.group.forEach((item) => item.css(style))
    }

    escape(): void {
        this.reset()
        this.currentElement = undefined
    }

    private select(element: Dom, ctrl = false): void {
        if (!ctrl) {
            this.reset()
        }
        element.addClass(this.className)
        this.group.push(element)
        this.currentElement?.focus()
    }

    private getElementPosition(element: Dom): CellPosition {
        const [column, row] = element.getAttr('data-id').split(':')
        return { row: Number.parseInt(row), column: Number.parseInt(column) }
    }

    private getSelectedGroup(startPosition: CellPosition, endPosition: CellPosition): Dom[] {
        const selected: Dom[] = []
        const [rowStart, rowEnd] =
            startPosition.row < endPosition.row
                ? [startPosition.row, endPosition.row]
                : [endPosition.row, startPosition.row]
        const [columnStart, columnEnd] =
            startPosition.column < endPosition.column
                ? [startPosition.column, endPosition.column]
                : [endPosition.column, startPosition.column]

        for (let rowDiff = rowStart; rowDiff <= rowEnd; rowDiff++) {
            for (let columnDiff = columnStart; columnDiff <= columnEnd; columnDiff++) {
                const target = this.getElementByPosition({ column: columnDiff, row: rowDiff })
                selected.push(target)
            }
        }
        return selected
    }

    private getElementByPosition(position: CellPosition): Dom {
        return this.rootElement.find(`[data-id="${position.column}:${position.row}"]`)
    }
}
