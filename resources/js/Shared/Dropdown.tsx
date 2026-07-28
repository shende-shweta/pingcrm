import { createPopper, Instance } from '@popperjs/core'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Placement = 'bottom-end' | 'bottom-start'

export default function Dropdown({
    children,
    dropdown,
    placement = 'bottom-end',
    autoClose = true,
    className,
}: {
    children: ReactNode
    dropdown: ReactNode
    placement?: Placement
    autoClose?: boolean
    className?: string
}) {
    const [show, setShow] = useState(false)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const popperRef = useRef<Instance | null>(null)

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShow(false)
            }
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [])

    useEffect(() => {
        if (show && triggerRef.current && dropdownRef.current) {
            popperRef.current = createPopper(triggerRef.current, dropdownRef.current, {
                placement,
                modifiers: [
                    {
                        name: 'preventOverflow',
                        options: {
                            altBoundary: true,
                        },
                    },
                ],
            })
        } else if (popperRef.current) {
            const instance = popperRef.current
            setTimeout(() => instance.destroy(), 100)
            popperRef.current = null
        }
    }, [show, placement])

    return (
        <>
            <button ref={triggerRef} type="button" className={className} onClick={() => setShow(true)}>
                {children}
            </button>
            {show &&
                createPortal(
                    <div>
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                right: 0,
                                left: 0,
                                bottom: 0,
                                zIndex: 99998,
                                background: 'black',
                                opacity: 0.2,
                            }}
                            onClick={() => setShow(false)}
                        />
                        <div
                            ref={dropdownRef}
                            style={{ position: 'absolute', zIndex: 99999 }}
                            onClick={() => {
                                if (!autoClose) {
                                    setShow((s) => !s)
                                }
                            }}
                        >
                            {dropdown}
                        </div>
                    </div>,
                    document.getElementById('dropdown')!,
                )}
        </>
    )
}
