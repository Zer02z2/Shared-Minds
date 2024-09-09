import { PaintProps } from "./paint"
import { line } from "../../library"

export interface RenderProps {
  ctx: CanvasRenderingContext2D
  dict: PaintProps["dict"]
  mode: PaintProps["renderMode"]
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

  render = ({ ctx, dict, mode, styles }: RenderProps) => {
    const containHover = this.sentence.find(
      (key) => dict[key].hoverState === true
    )
    const renderStyle = containHover ? styles.focus : styles.blur

    this.sentence.forEach((word, index) => {
      dict[word].style = renderStyle
      ctx.fillStyle = renderStyle
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
