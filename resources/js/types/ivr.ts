export interface Column {
    key: string
    label: string
}

export interface Row {
    id?: string | number
    [key: string]: string | number | undefined
}

export interface ModuleTab {
    slug: string
    title: string
}
