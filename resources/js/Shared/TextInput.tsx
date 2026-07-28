import { InputHTMLAttributes, useId } from 'react'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
    className?: string
    error?: string
    label?: string
}

export default function TextInput({ className, error, label, id, type = 'text', value, onChange, ...rest }: Props) {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
        <div className={className}>
            {label && (
                <label className="form-label" htmlFor={inputId}>
                    {label}:
                </label>
            )}
            <input
                id={inputId}
                className={`form-input${error ? ' error' : ''}`}
                type={type}
                value={value ?? ''}
                onChange={onChange}
                {...rest}
            />
            {error && <div className="form-error">{error}</div>}
        </div>
    )
}
