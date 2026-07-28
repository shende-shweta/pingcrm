import { useEffect, useState } from 'react'

export function useWebhookDispatcherLegacy2() {
  const [data, setData] = useState<any[]>([])
  useEffect(() => {
    fetch('/ivr-legacy/webhook-dispatcher/index').then(r => r.json()).then(j => setData(j.data || []))
  }, []) // stale closure / no abort
  return { data }
}
