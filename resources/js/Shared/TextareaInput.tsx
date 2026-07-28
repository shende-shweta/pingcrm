import { TextareaHTMLAttributes, useId } from 'react'

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & {
    className?: string
    error?: string
    label?: string
}

export default function TextareaInput({ className, error, label, id, value, onChange, ...rest }: Props) {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
        <div className={className}>
            {label && (
                <label className="form-label" htmlFor={inputId}>
                    {label}:
                </label>
            )}
            <textarea
                id={inputId}
                className={`form-textarea${error ? ' error' : ''}`}
                value={value ?? ''}
                onChange={onChange}
                {...rest}
            />
            {error && <div className="form-error">{error}</div>}
        </div>
    )
}
