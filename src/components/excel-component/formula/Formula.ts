import { ExcelComponent } from '@core/basics/ExcelComponent'
import { dom, Dom } from '@core/framework/dom'
import { ExcelComponentOptions } from '@components/excel-component/excel/Excel.models'

const enum KeyControl {
    enter = 'Enter',
    tab = 'Tab'
}

export class Formula extends ExcelComponent {
    static className = 'formula'
    private inputElement: Dom

    constructor(rootElement: Dom, options: ExcelComponentOptions) {
        super(rootElement, {
            name: 'Formula',
            listeners: ['input', 'keydown'],
            ...options
        })
    }

    init(): void {
        super.init()
        this.inputElement = this.rootElement.find('input')
        this.initSubscriptions()
    }

    toHTML(): string {
        return `
              <div class='info'>fx</div>
              <input type='text' spellcheck='false'>
        `
    }

    onInput(event: InputEvent): void {
        this.$emit('formula:input', dom(event.target as HTMLInputElement)?.text)
    }

    onKeydown(event: KeyboardEvent): void {
        switch (event.code) {
            case KeyControl.enter:
            case KeyControl.tab:
                event.preventDefault()
                this.$emit('formula:keydown:enter', true)
                break
            default:
                break
        }
    }

    private initSubscriptions(): void {
        this.$on('table:select', (text: string) => {
            this.inputElement.text = text
        })
    }
}
