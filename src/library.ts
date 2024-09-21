export const Random = {
  float: (min: number, max: number): number => {
    const delta = Math.random() * (max - min)
    return min + delta
  },
  integer: (min: number, max: number): number => {
    return Math.floor(Random.float(min, max))
  },
}

export const getElementPosition = (e: HTMLElement | HTMLInputElement) => {
  const box = e.getBoundingClientRect()
  const [x, y] = [box.left, box.top]
  return [x, y]
}

export const line = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

export const HTMLElement: {
  createText: (tag: string, content?: string, clasName?: string) => HTMLElement
  createImage: (
    src: string,
    alt: string,
    className?: string
  ) => HTMLImageElement
} = {
  createText: (tag, content, className) => {
    const element = document.createElement(tag)
    if (content) {
      const textNode = document.createTextNode(content)
      element.appendChild(textNode)
    }
    if (className) {
      element.classList.add(className)
    }
    return element
  },
  createImage: (src, alt, className) => {
    const img = document.createElement("img")
    img.src = src
    img.alt = alt
    if (className) img.classList.add(className)
    return img
  },
}

export const removeChildren = (e: HTMLElement): void => {
  while (e.lastChild) {
    e.removeChild(e.lastChild)
  }
}
