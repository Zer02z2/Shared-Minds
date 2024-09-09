import { line } from "../library"

interface PaintProps {
  dict: { [word: string]: Word }
  sentences: Sentence[]
  init: () => void
  addWord: (word: string, x: number, y: number) => void
  endSentence: () => void
  render: (ctx: CanvasRenderingContext2D) => void
}

export const Paint: PaintProps = {
  dict: {},
  sentences: [],
  init: () => {
    let sentences = Paint.sentences
    const emptySentece = new Sentence()
    sentences = [...sentences, emptySentece]
    console.log(sentences)
  },
  addWord: (word, x, y) => {
    const { dict, sentences } = Paint
    if (!dict[word]) {
      dict[word] = new Word(1, x, y)
    } else {
      dict[word].occurrence++
    }
    console.log(sentences)
    sentences[sentences.length - 1].addWord(word)
  },
  endSentence: () => {
    let { sentences } = Paint
    const emptySentece = new Sentence()
    sentences = [...sentences, emptySentece]
  },
  render: (ctx: CanvasRenderingContext2D) => {
    Paint.sentences.forEach((sentence) => sentence.render(ctx, Paint.dict))
  },
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

  constructor() {
    this.sentence = []
  }

  addWord = (word: string) => {
    this.sentence = [...this.sentence, word]
  }

  render = (ctx: CanvasRenderingContext2D, dict: PaintProps["dict"]) => {
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
