export class Dom {
    private readonly nativeElement: HTMLElement

    get element(): HTMLElement {
        return this.nativeElement
    }

    get dataset(): DOMStringMap {
        return this.nativeElement?.dataset
    }

    set text(value: string) {
        if (value !== undefined && value !== null) {
            if (this.nativeElement && this.nativeElement.tagName?.toLowerCase() === 'input') {
                ;(this.nativeElement as HTMLInputElement).value = value
            } else {
                this.nativeElement && (this.nativeElement.innerText = value)
            }
        }
    }

    get text(): string {
        if (this.nativeElement && this.nativeElement.tagName?.toLowerCase() === 'input') {
            return (this.nativeElement as HTMLInputElement).value?.trim()
        } else {
            return this.nativeElement?.textContent?.trim() || ''
        }
    }

    constructor(selector: string | HTMLElement) {
        if (selector instanceof HTMLElement) {
            this.nativeElement = selector
        } else {
            this.nativeElement = document.querySelector(selector) as HTMLElement
        }
    }

    html(html?: string): Dom | string {
        if (typeof html === 'string') {
            this.nativeElement.innerHTML = html
            return this
        } else {
            return this.nativeElement.outerHTML.trim()
        }
    }

    clear(): Dom {
        this.html('')
        return this
    }

    append(node: HTMLElement | Dom | string): Dom {
        if (typeof node === 'string') {
            this.nativeElement.insertAdjacentHTML('beforeend', node)
        } else if (node instanceof Dom) {
            this.nativeElement.append(node.nativeElement)
        } else {
            this.nativeElement.append(node)
        }
        return this
    }

    addClass(className: string): Dom {
        this.nativeElement?.classList.add(className)
        return this
    }

    hasData(value: string): boolean {
        return this.nativeElement.dataset.hasOwnProperty(value)
    }

    removeClass(className: string): Dom {
        this.nativeElement?.classList.remove(className)
        return this
    }

    addAttr(name: string, value: string): Dom {
        this.nativeElement?.setAttribute(name, value)
        return this
    }

    removeAttr(name: string): Dom {
        this.nativeElement?.removeAttribute(name)
        return this
    }

    getAttr(name: string): any {
        return this.nativeElement?.getAttribute(name)
    }

    removeDataAttr(name: string): Dom {
        return this.removeAttr(`data-${name}`)
    }

    getDataAttr(attr: string): any {
        return this.getAttr(`data-${attr}`)
    }

    getCoords(): DOMRect {
        return this.nativeElement?.getBoundingClientRect()
    }

    parent(selector: string): Dom {
        return dom(this.nativeElement?.closest(selector) as HTMLElement)
    }

    children(selector: string): Dom[] {
        return Array.from(this.nativeElement.querySelectorAll(selector)).map((element: any) => dom(element))
    }

    getStyle(value: string): any {
        return window?.getComputedStyle(this.nativeElement, '')?.getPropertyValue(value)
    }

    style(name: any, value: any, dimension = 'px'): Dom {
        if (this.nativeElement) {
            this.nativeElement.style[name] = value + dimension
        }
        return this
    }

    css(object: { [key: string]: string }): Dom {
        Object.keys(object).forEach((key) => {
            this.style(key, object[key], '')
        })
        return this
    }

    getCss(styleFilter?: string[]): any {
        return styleFilter?.reduce((acc: any, style: any) => {
            acc[style] = this.nativeElement?.style[style]
            return acc
        }, {})
    }

    on(event: string, callback: () => any): void {
        this.nativeElement.addEventListener(event, callback)
    }

    off(event: string, callback: () => any): void {
        this.nativeElement.removeEventListener(event, callback)
    }

    find(selector: string): Dom {
        return dom(this.nativeElement?.querySelector(selector) as HTMLElement)
    }

    focus(): Dom {
        this.nativeElement?.focus()
        return this
    }

    blur(): Dom {
        this.nativeElement?.blur()
        return this
    }
}

export function dom(selector: string | HTMLElement): Dom {
    return new Dom(selector)
}

dom.createByTag = (tagName: string) => {
    const el = document.createElement(tagName)
    return dom(el)
}
