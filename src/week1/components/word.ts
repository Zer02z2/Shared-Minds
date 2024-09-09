export class Word {
  occurrence: number
  x: number
  y: number
  length: number
  hoverState: boolean

  constructor(occurrence: number, x: number, y: number, length: number) {
    this.occurrence = occurrence
    this.x = x
    this.y = y
    this.length = length
    this.hoverState = false
  }
}
