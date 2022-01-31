import { dom, Dom } from '@core/framework/dom'
import { EventEmitter } from '@core/RxJs/EventEmitter'
import { StoreSubscriber } from '@core/store/StoreSubscriber'
import { AppExcelOptions, ExcelComponentOptions } from '@components/excel-component/excel/Excel.models'

export class Excel {
    private readonly element: Dom = dom.createByTag('div')
    private readonly emitter = new EventEmitter()
    private readonly subscriber = new StoreSubscriber(this.options.store)
    private readonly componentOptions: ExcelComponentOptions = { emitter: this.emitter, store: this.options.store }

    constructor(private readonly options: AppExcelOptions) {
        this.element.append(this.rootElement)
    }

    init(): void {
        this.subscriber.subscribe(this.options.components) // Подписка на один источник изменения state (redux)
        this.options.components.forEach((c: any) => c.init()) // Вызов метода init у всех компонентов Excel
    }

    getRoot(): Dom {
        return this.element
    }

    private get rootElement(): Dom {
        const controls = dom.createByTag('header').addClass('excel__control')
        const rootNode = dom.createByTag('div').addClass('excel')

        rootNode.append(controls)

        this.options.components = this.options.components.map((Component, index, array) => {
            let instance
            if (index === array.length - 1) {
                const main = dom.createByTag('main').addClass(Component.className)
                instance = new Component(main, this.componentOptions)
                main.html(instance.toHTML())
                rootNode.append(main)
            } else {
                const control = dom.createByTag('div').addClass(Component.className)
                instance = new Component(control, this.componentOptions)
                control.html(instance.toHTML())
                controls.append(control)
            }

            return instance
        })

        return rootNode
    }

    destroy(): void {
        this.subscriber.unsubscribe()
        this.options.components.forEach((c: any) => c.destroy())
    }
}
