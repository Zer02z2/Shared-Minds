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

export const HTMLText: {
  create: (tag: string, content?: string, clasName?: string) => HTMLElement
} = {
  create: (tag, content, className) => {
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
}

export const removeChildren = (e: HTMLElement): void => {
  while (e.lastChild) {
    e.removeChild(e.lastChild)
  }
}
