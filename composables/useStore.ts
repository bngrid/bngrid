export const useStore = defineStore('store', () => {
  const list = ref([
    [
      {
        id: 'BNID-0',
        name: 'Slide',
        scope: [2, 1, 3, 2]
      }
    ],
    [
      {
        id: 'BNID-1',
        name: 'Slide',
        scope: [2, 1, 3, 2]
      }
    ],
    [], []
  ])
  const site = ref([4, 7, 60, 20])

  return { list, site }
})
