import { PaintProps } from "./paint"
import { line } from "../../library"

interface RenderProps {
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
    if (mode === "blur") {
      ctx.fillStyle = styles.dark
    } else {
      if (this.sentence.find((key) => dict[key].hoverState === true)) {
        ctx.fillStyle = styles.dark
      } else {
        ctx.fillStyle = "gray"
      }
    }
    this.sentence.forEach((word, index) => {
      ctx.fillText(word, dict[word].x, dict[word].y)
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
