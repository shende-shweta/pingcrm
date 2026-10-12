export interface IvrColumn {
    key: string
    label: string
}

export interface IvrRow {
    id?: string | number
    [key: string]: string | number | undefined
}

export interface IvrModuleTab {
    slug: string
    title: string
}
