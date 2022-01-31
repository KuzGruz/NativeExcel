import { StoreState } from '@core/store/Store'
import { dateFormat, storage } from '@core/utils'

const REGEXP_EXCEL = /(?<type>excel:)(?<id>\d+)/

export function toHTML(id: string): string {
    const excel: StoreState = storage(id)
    const identifier = (id.match(REGEXP_EXCEL) as any).groups.id
    const time = dateFormat(new Date(parseInt(excel.modified as string)), 'dd/MM/yyyy HH:mm:SS')
    return `
        <li class='record'>
            <a href='#excel/${identifier}'>
                <span>${excel.tableTitleState}</span>
                <strong>${time}</strong>
            </a>   
        </li>
    `
}

function getAllKeys(): string[] {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) as string
        if (key.match(REGEXP_EXCEL)) {
            keys.push(key)
        }
    }
    return keys
}

export function createRecordsTable(): string {
    const excels = getAllKeys()
    if (excels.length) {
        return `
            <div class='db__table-header'>
                <span>Name</span>
                <span>Last visited</span>
            </div>
            <ul class='db__table-list'>${excels.map(toHTML).join('')}</ul>
        `
    } else {
        return '<p class="empty">List empty</p>'
    }
}
