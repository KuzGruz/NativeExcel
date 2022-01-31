export interface Client {
    save: (state: any) => Promise<any>
    get: () => Promise<any>
}
