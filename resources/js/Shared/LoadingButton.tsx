import { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean
    children: ReactNode
}

export default function LoadingButton({ loading, children, className, ...rest }: Props) {
    return (
        <button disabled={loading} className={`flex items-center ${className ?? ''}`} {...rest}>
            {loading && <div className="btn-spinner mr-2" />}
            {children}
        </button>
    )
}
