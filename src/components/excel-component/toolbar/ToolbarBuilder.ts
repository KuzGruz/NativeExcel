import { ButtonModel, TOOLBAR_BUTTONS } from '@components/excel-component/toolbar/Toolbar.models'

export class ToolbarBuilder {
    private defaultButtons: ButtonModel[] = TOOLBAR_BUTTONS

    constructor() {}

    template(state: any): string {
        this.defaultButtons = this.updateButtonsState(state)
        return this.defaultButtons.map(ToolbarBuilder.getButtonTemplate).join('')
    }

    private static getButtonTemplate(button: ButtonModel): string {
        const meta = `
            data-toolbar-button
            data-style=${JSON.stringify(button.style)}
        `
        return `
                <div class='button ${button.isActive ? 'active' : ''}' ${meta}>
                    <span class='material-icons'>${button.icon}</span>
                </div>
        `
    }

    private updateButtonsState(state: any): ButtonModel[] {
        return this.defaultButtons.map((button) => {
            const name = Object.keys(button.style)[0]
            const value = state[name] === button.targetValue ? button.defaultValue : button.targetValue
            const style = { [name]: value }
            // @ts-ignore
            const isActive = state[name] === button.targetValue
            return { ...button, style, isActive }
        })
    }
}
