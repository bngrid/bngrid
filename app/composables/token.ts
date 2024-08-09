export const useToken = () => {
  const keep = useCookie('keep', {
    maxAge: 60 * 60 * 24 * 365
  })
  keep.value = keep.value || 'true'
  const token = useCookie('token', {
    maxAge: !!keep.value ? 60 * 60 * 24 * 365 : undefined
  })
  token.value = token.value || ''
  return token
}
