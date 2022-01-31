/**
 * @jest-environment jsdom
 */

import { Router } from '@core/routes/Router'
import { Page } from '@core/page/Page'
import { dom, Dom } from '@core/framework/dom'

class DashboardPage extends Page {
    async getRoot(): Promise<string | Dom> {
        const root = document.createElement('div')
        root.innerHTML = 'dashboard'
        return dom(root)
    }
}

class ExcelPage extends Page {
    async getRoot(): Promise<string | Dom> {
        const root = document.createElement('div')
        root.innerHTML = 'excel'
        return dom(root)
    }
}

describe('Router', () => {
    let router: Router
    const root = document.createElement('div')
    const routes = [
        { path: 'dashboard', component: DashboardPage },
        { path: 'excel', component: ExcelPage }
    ]

    beforeEach(() => {
        router = new Router(root, routes)
    })

    test('should be define', () => {
        expect(router).toBeDefined()
    })

    test('should render dashboard page', async () => {
        await router.changePageHandler()
        expect(root.innerHTML).toBe('<div>dashboard</div>')
    })
})
