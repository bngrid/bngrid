export const useStore = defineStore('store', () => {
  const list = ref([
    [
      {
        id: 'BNID-0',
        name: 'Time',
        scope: [1, 1, 3, 2]
      },
      {
        id: 'BNID-1',
        name: 'Web',
        scope: [4, 1, 1, 2]
      },
      {
        id: 'BNID-2',
        name: 'Text',
        scope: [1, 3, 2, 2]
      }
    ]
  ])
  const site = ref([4, 7, 60, 20])

  return { list, site }
})
