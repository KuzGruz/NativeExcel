export interface ButtonModel {
    icon: string
    isActive?: boolean
    style: ToolbarStyleStates
    readonly targetValue: string
    readonly defaultValue: string
}

export interface ToolbarStyleStates {
    textAlign?: 'left' | 'right' | 'center'
    fontWeight?: 'bold' | 'normal'
    fontStyle?: 'italic' | 'normal'
    textDecoration?: 'underlined' | 'none'
}

export const DEFAULT_STYLES: { [key: string]: string } = {
    textAlign: 'left',
    fontWeight: 'normal',
    textDecoration: 'none',
    fontStyle: 'normal'
}

export const TOOLBAR_BUTTONS: ButtonModel[] = [
    {
        icon: 'format_align_left',
        style: { textAlign: 'left' },
        targetValue: 'left',
        defaultValue: 'left'
    },
    {
        icon: 'format_align_center',
        style: { textAlign: 'center' },
        targetValue: 'center',
        defaultValue: 'left'
    },
    {
        icon: 'format_align_right',
        style: { textAlign: 'right' },
        targetValue: 'right',
        defaultValue: 'left'
    },
    {
        icon: 'format_bold',
        style: { fontWeight: 'bold' },
        targetValue: 'bold',
        defaultValue: 'normal'
    },
    {
        icon: 'format_italic',
        style: { fontStyle: 'italic' },
        targetValue: 'italic',
        defaultValue: 'normal'
    },
    {
        icon: 'format_underlined',
        style: { textDecoration: 'underlined' },
        targetValue: 'underline',
        defaultValue: 'none'
    }
]
