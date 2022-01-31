import { Dom, dom } from '@core/framework/dom'

export class Loader {
    get template(): Dom {
        return dom.createByTag('div').addClass('loader').html(
            `
                <div class='lds-roller'><div>
                </div><div>
                </div><div>
                </div><div>
                </div><div>
                </div><div>
                </div><div>
                </div><div>
                </div></div>
            `
        ) as Dom
    }
}
