import { Page } from '@core/page/Page'
import { dom } from '@core/framework/dom'

export class NotFoundPage extends Page {
    getRoot(): any {
        return dom.createByTag('div').addClass('not-found')
    }
}
