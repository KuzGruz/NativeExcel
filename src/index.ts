import '@styles/style.scss'
import { Router } from '@core/routes/Router'
import { DashboardPage } from './pages/Dashboard.page'
import { ExcelPage } from './pages/Excel.page'
import { NotFoundPage } from './pages/NotFound.page'

new Router('#app', [
    { path: 'dashboard', component: DashboardPage },
    { path: 'excel', component: ExcelPage },
    { path: '404', component: NotFoundPage }
])
