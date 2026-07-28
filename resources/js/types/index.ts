export interface Account {
    id: number
    name: string
}

export interface AuthUser {
    id: number
    first_name: string
    last_name: string
    email: string
    owner: boolean
    account: Account
}

export interface SharedPageProps {
    auth: {
        user: AuthUser | null
    }
    flash: {
        success?: string | null
        error?: string | null
    }
    errors: Record<string, string>
}

export interface PaginationLink {
    url: string | null
    label: string
    active: boolean
}

export interface Paginated<T> {
    data: T[]
    links: PaginationLink[]
}
