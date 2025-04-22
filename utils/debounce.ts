export default function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  wait = 300
) {
  let timer = 0
  return (...args: Args) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = +setTimeout(() => {
      func(...args)
      timer = 0
    }, wait)
  }
}
