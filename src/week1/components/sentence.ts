import { PaintProps } from "./paint"
import { line } from "../../library"

export interface RenderProps {
  ctx: CanvasRenderingContext2D
  dict: PaintProps["dict"]
  styles: PaintProps["styles"]
}

export class Sentence {
  sentence: string[]

  constructor() {
    this.sentence = []
  }

  addWord = (word: string) => {
    this.sentence = [...this.sentence, word]
  }

  render = ({ ctx, dict, styles }: RenderProps) => {
    const hoveredWord = this.sentence.find(
      (key) => dict[key].hoverState === true
    )
    ctx.strokeStyle = hoveredWord ? styles.focus : styles.blur

    this.sentence.forEach((word, index) => {
      if (hoveredWord) dict[word].style = styles.focus
      const previousWord = index > 0 ? this.sentence[index - 1] : null
      if (!previousWord) return
      line(
        ctx,
        dict[previousWord].x,
        dict[previousWord].y,
        dict[word].x,
        dict[word].y
      )
    })
  }
}
