import { dom, Dom } from '@core/framework/dom'
import { Route } from '@core/routes/Router.models'
import { ActiveRoute } from '@core/routes/ActiveRoute'
import { Page } from '@core/page/Page'
import { Loader } from '@components/loader/Loader'

export class Router {
    protected placeholder: Dom
    protected routes: Route[]
    private readonly notFoundPage: Route
    private readonly defaultPage: Route
    private page: Page
    protected readonly loader: Loader = new Loader()

    get currentRoute(): Route | undefined {
        return this.routes.find((route: Route) => route.path === ActiveRoute.params[0])
    }

    constructor(selector: string | HTMLElement, routes: Route[]) {
        if (!selector) {
            throw new Error('Selector is not provided in Router')
        }
        this.placeholder = dom(selector)
        this.defaultPage = routes[0]
        this.notFoundPage = routes[routes.length - 1]
        this.routes = routes

        this.changePageHandler = this.changePageHandler.bind(this)
        this.init()
    }

    async init(): Promise<void> {
        window.addEventListener('hashchange', this.changePageHandler)
        ActiveRoute.navigate(this.defaultPage.path)
        await this.navigate(this.defaultPage)
    }

    async changePageHandler(): Promise<void> {
        const currentPage = this.currentRoute
        if (currentPage && this.routes.indexOf(currentPage) >= 0) {
            await this.navigate(currentPage)
        } else {
            await this.navigate(this.notFoundPage)
        }
    }

    async navigate(route: Route): Promise<void> {
        if (this.page) {
            this.page.destroy()
        }
        this.placeholder.clear().append(this.loader.template)

        const Page = route.component
        this.page = new Page(ActiveRoute.params)
        const root = await this.page.getRoot()

        this.placeholder.clear().append(root)

        this.page.afterRender()
    }

    destroy(): void {
        window.removeEventListener('hashchange', this.changePageHandler)
    }
}
