import { ReactNode, SelectHTMLAttributes, useId } from 'react'

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'children'> & {
    className?: string
    error?: string
    label?: string
    children?: ReactNode
}

export default function SelectInput({ className, error, label, id, children, value, onChange, ...rest }: Props) {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
        <div className={className}>
            {label && (
                <label className="form-label" htmlFor={inputId}>
                    {label}:
                </label>
            )}
            <select id={inputId} className={`form-select${error ? ' error' : ''}`} value={value ?? ''} onChange={onChange} {...rest}>
                {children}
            </select>
            {error && <div className="form-error">{error}</div>}
        </div>
    )
}
