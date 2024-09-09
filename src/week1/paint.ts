// interface Word {
//   occurrence: number
//   x: number
//   y: number
// }

import { line } from "../library"

interface PaintProps {
  dict: { [word: string]: Word }
  sentences: Sentence[]
  addWord: (word: string, x: number, y: number) => void
  addSentence: (sentence: string[]) => void
  render: () => void
}

export const Paint: PaintProps = {
  dict: {},
  sentences: [],
  addWord: (word, x, y) => {
    if (!Paint.dict[word]) {
      Paint.dict[word] = new Word(1, x, y)
    } else {
      Paint.dict[word].occurrence++
    }
  },
  addSentence: (sentence: string[]) => {
    const newSentence = new Sentence(sentence)
    Paint.sentences = [...Paint.sentences, newSentence]
  },
  render: () => {},
}

class Word {
  occurrence: number
  x: number
  y: number

  constructor(occurrence: number, x: number, y: number) {
    this.occurrence = occurrence
    this.x = x
    this.y = y
  }
}

class Sentence {
  sentence: string[]

  constructor(sentence: string[]) {
    this.sentence = sentence
  }

  render = (ctx: CanvasRenderingContext2D, dict: PaintProps["dict"]) => {
    this.sentence.forEach((word, index) => {
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
