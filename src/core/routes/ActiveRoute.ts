export class ActiveRoute {
    static get path(): string {
        return window.location.hash.slice(1)
    }

    static get params(): string[] {
        return ActiveRoute.path.split('/')
    }

    static setHash(hash: string): void {
        window.location.hash = hash
    }

    static navigate(hash: string): void {
        ActiveRoute.setHash(`#${hash}`)
    }
}
