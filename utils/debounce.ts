export default function debounce<T extends unknown[]>(func: (...args: T) => void, wait = 300) {
  let timer = 0
  return (...args: T) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = +setTimeout(() => {
      func(...args)
      timer = 0
    }, wait)
  }
}
