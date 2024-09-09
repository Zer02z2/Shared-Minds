import { RenderProps } from "./sentence"

export class Word {
  value: string
  occurrence: number
  x: number
  y: number
  length: number
  hoverState: boolean
  style: string

  constructor(
    value: string,
    occurrence: number,
    x: number,
    y: number,
    length: number,
    style: string
  ) {
    this.value = value
    this.occurrence = occurrence
    this.x = x
    this.y = y
    this.length = length
    this.hoverState = false
    this.style = style
  }

  render = (ctx: RenderProps["ctx"]) => {
    ctx.fillStyle = this.style
    ctx.fillText(this.value, this.x, this.y)
  }
}
