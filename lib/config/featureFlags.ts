export async function isAuthFeatureEnabled(): Promise<boolean> {
  const envFlag = process.env.NEXT_PUBLIC_ENABLE_AUTH
  if (envFlag !== undefined) {
    return envFlag === 'true'
  }
  const serviceUrl = process.env.FEATURE_SERVICE_URL
  if (serviceUrl) {
    try {
      const res = await fetch(`${serviceUrl}/auth`)
      if (!res.ok) return false
      const data = (await res.json()) as { enabled?: boolean }
      return data.enabled === true
    } catch {
      return false
    }
  }
  return false
}
