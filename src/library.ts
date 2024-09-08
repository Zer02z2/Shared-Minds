export const Random = {
  float: (min: number, max: number) => {
    const delta = Math.random() * (max - min)
    return min + delta
  },
  integer: (min: number, max: number) => {
    return Math.floor(Random.float(min, max))
  },
}

export const getElementPosition = (e: HTMLElement | HTMLInputElement) => {
  const box = e.getBoundingClientRect()
  const [x, y] = [box.left, box.top]
  return [x, y]
}
