import { ReactNode } from 'react'
import Icon from '@/Shared/Icon'

export default function TrashedMessage({ children, onRestore }: { children: ReactNode; onRestore: () => void }) {
    return (
        <div className="flex max-w-3xl items-center justify-between rounded bg-yellow-400 p-4">
            <div className="flex items-center">
                <Icon name="trash" className="mr-2 h-4 w-4 shrink-0 fill-yellow-800" />
                <div className="text-sm font-medium text-yellow-800">{children}</div>
            </div>
            <button className="text-sm text-yellow-800 hover:underline" tabIndex={-1} type="button" onClick={onRestore}>
                Restore
            </button>
        </div>
    )
}
