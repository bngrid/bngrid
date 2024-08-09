export default defineNuxtRouteMiddleware(async to => {
  const token = useToken()
  const data = await $fetch('/api/auth/user', {
    headers: {
      authorization: `Bearer ${token.value}`
    }
  })
  if (to.path !== '/login' && !data.flag) {
    const addToast = useToast()
    addToast(data)
    return navigateTo('/login')
  }
})
