import { Page } from '@core/page/Page'
import { dom } from '@core/framework/dom'
import { createRecordsTable } from '@components/dashboard-component/dashboard-functions'

export class DashboardPage extends Page {
    getRoot(): any {
        const id = Date.now().toString()
        return dom.createByTag('div').addClass('db').html(
            `
                    <header class='db__header'>
                        <h1>Excel Dashboard</h1>
                    </header>
                    <nav class='db__new'>
                        <div class='db__container'>
                            <a href='#excel/${id}'>New<br />Table</a>
                        </div>
                    </nav>
                    <main class='db__table db__container'>
                        ${createRecordsTable()}
                    </main>
            `
        )
    }
}
