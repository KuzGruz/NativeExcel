import { ExcelComponent } from '@core/basics/ExcelComponent'
import { dom, Dom } from '@core/framework/dom'
import * as actions from '@redux/redux.actions'
import { debounce, removeStorage } from '@core/utils'
import { ExcelComponentOptions } from '@components/excel-component/excel/Excel.models'
import { HEADER_ACTIONS } from '@components/excel-component/header/Header.models'
import { ActiveRoute } from '@core/routes/ActiveRoute'

export class Header extends ExcelComponent {
    static className = 'header'

    get template(): string {
        const title = this.store?.getState().tableTitleState
        return `
                <input type='text' value='${title}'>
                <div class='actions'>
                    <div class='button' data-header-action='delete'>
                        <span class='material-icons'>delete_outline</span>
                    </div>
                    <div class='button' data-header-action='exit'>
                        <span class='material-icons'>exit_to_app</span>
                    </div>
                </div>
        `
    }

    constructor(rootElement: Dom, options: ExcelComponentOptions) {
        super(rootElement, {
            name: 'Header',
            listeners: ['input', 'click'],
            ...options
        })
    }

    prepare(): void {
        this.onInput = debounce(this.onInput, 400)
    }

    toHTML(): string {
        return this.template
    }

    onInput(event: InputEvent): void {
        const input = dom(event.target as HTMLElement)
        this.$dispatch(actions.changeTableTitle({ value: input.text }))
    }

    onClick(event: MouseEvent): void {
        const target = dom(event.target as HTMLElement).parent('[data-header-action]')
        if (target) {
            switch (target.dataset?.headerAction) {
                case HEADER_ACTIONS.DELETE:
                    removeStorage(`excel:${ActiveRoute.params[1]}`)
                    ActiveRoute.navigate('dashboard')
                    break
                case HEADER_ACTIONS.EXIT:
                    ActiveRoute.navigate('dashboard')
                    break
            }
        }
    }
}
