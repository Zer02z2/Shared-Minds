import { Word } from "./word"
import { Sentence } from "./sentence"

export interface PaintProps {
  dict: { [word: string]: Word }
  sentences: Sentence[]
  renderMode: "focus" | "blur"
  styles: { dark: string; light: string }
  init: () => void
  addWord: (word: string, x: number, y: number) => void
  endSentence: () => void
  checkHover: (mouseX: number, mouseY: number, fontSize: number) => boolean
  render: (ctx: CanvasRenderingContext2D) => void
}

export const Paint: PaintProps = {
  dict: {},
  sentences: [],
  renderMode: "blur",
  styles: { dark: "black", light: "gray" },
  init: () => {
    const emptySentece = new Sentence()
    Paint.sentences = [...Paint.sentences, emptySentece]
  },
  addWord: (word, x, y) => {
    if (!Paint.dict[word]) {
      Paint.dict[word] = new Word(1, x, y, word.length)
    } else {
      Paint.dict[word].occurrence++
    }
    Paint.sentences[Paint.sentences.length - 1].addWord(word)
  },
  endSentence: () => {
    const emptySentece = new Sentence()
    Paint.sentences = [...Paint.sentences, emptySentece]
  },
  checkHover: (mouseX, mouseY, fontSize) => {
    const keyArray = Object.keys(Paint.dict)
    const hoveredWord = keyArray.find((key) => {
      return (
        Paint.dict[key].x <= mouseX &&
        Paint.dict[key].x + Paint.dict[key].length * fontSize * 0.5 >= mouseX &&
        Paint.dict[key].y >= mouseY &&
        Paint.dict[key].y - fontSize <= mouseY
      )
    })
    if (!hoveredWord) {
      keyArray.forEach((key) => (Paint.dict[key].hoverState = false))
      Paint.renderMode = "blur"
      return false
    } else {
      Paint.dict[hoveredWord].hoverState = true
      Paint.renderMode = "focus"
      return true
    }
  },
  render: (ctx: CanvasRenderingContext2D) => {
    Paint.sentences.forEach((sentence) => {
      sentence.render({
        ctx: ctx,
        dict: Paint.dict,
        mode: Paint.renderMode,
        styles: Paint.styles,
      })
    })
  },
}
