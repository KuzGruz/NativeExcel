import { dom, Dom } from '@core/framework/dom'
import { TableBuilder } from '@components/excel-component/table/TableBuilder'
import { TableSelection } from '@components/excel-component/table/TableSelection'

const enum TableElement {
    column = 'col',
    row = 'row'
}

export function resizeHandler(rootElement: Dom, resizer: Dom, event: MouseEvent): Promise<any> {
    event.preventDefault()

    return new Promise((resolve) => {
        resizer?.addClass('active')

        let array: Dom[] = []
        let initPosition: number
        let size: number

        const parent = resizer.parent('[data-resizeable]')
        const type = parent.dataset?.resizeable
        const coords = parent.getCoords() || {}

        if (type === TableElement.column) {
            const index = parent.dataset?.index
            array = rootElement.children(`[data-index="${index}"]`)
            initPosition = parseInt(resizer.getStyle('right'))
        } else {
            initPosition = parseInt(resizer.getStyle('bottom'))
        }

        document.onmousemove = (e) => {
            event.preventDefault()
            if (type === TableElement.column) {
                const diff = e.clientX - coords.right
                size = coords.width + diff
                resizer.style('right', initPosition - diff)
            } else {
                const diff = e.clientY - coords.bottom
                size = coords.height + diff
                resizer.style('bottom', initPosition - diff)
            }
        }

        document.onmouseup = () => {
            event.preventDefault()
            resizer.removeClass('active')
            if (type === TableElement.column) {
                resizer.style('right', initPosition)
                array.forEach((el) => el.style('width', size))
            } else {
                resizer.style('bottom', initPosition)
                parent.style('height', size)
            }

            resolve({ value: size, id: parent.dataset?.index })
            document.onmousemove = null
            document.onmouseup = null
        }
    })
}

export function doubleClickResizeHandler(rootElement: Dom, resizer: Dom, event: MouseEvent): void {
    event.preventDefault()
    const parent = resizer.parent('[data-resizeable]')
    const type = parent.dataset?.resizeable
    if (type === TableElement.column) {
        const index = parent.dataset?.index
        const array = rootElement.children(`[data-index="${index}"]`)
        array.forEach((el) => el.style('width', TableBuilder.cellDataWidth))
    } else {
        parent.style('height', TableBuilder.rowsHeight)
    }
}

export function cellSelection(rootElement: Dom, selection: TableSelection, target: Dom, event: MouseEvent): void {
    selection.startSelection(target, event.ctrlKey)
    document.onmouseup = (e) => {
        if (dom(e.target as HTMLElement).hasData('data')) {
            selection.endSelection(dom(e.target as HTMLElement))
        }
        document.onmouseup = null
    }
}
