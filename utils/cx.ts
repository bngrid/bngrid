type MixValue = boolean | MixValue[] | null | number | string | undefined | { [key: string]: unknown }

export default function cx(...values: MixValue[]) {
  const set = new Set()
  function append(value: MixValue) {
    if (!value || value === true || typeof value === 'number') return
    else if (typeof value === 'string') {
      const classes = value.trim().split(/\s+/)
      for (const cls of classes) if (cls) set.add(cls)
    } else if (Array.isArray(value)) for (const item of value) append(item)
    else for (const [key, val] of Object.entries(value)) if (val) set.add(key)
  }
  for (const value of values) append(value)
  return Array.from(set).join(' ')
}
