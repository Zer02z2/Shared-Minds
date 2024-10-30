import { fetchEmbedding } from "./fetch"
import { UMAP } from "umap-js"
import seedrandom from "seedrandom"
import { lerp } from "../library"

const cnv = document.getElementById("canvas") as HTMLCanvasElement
const ctx = cnv.getContext("2d")
const input = document.getElementById("input-field") as HTMLInputElement

interface WordBlock {
  text: string
  x: number
  y: number
  xTarget?: number
  yTarget?: number
}
interface WordBlocks {
  [name: string]: WordBlock
}

const wordBlocks: WordBlocks = {}

const init = () => {
  if (!(cnv && ctx && input)) return
  cnv.width = window.innerWidth
  cnv.height = window.innerHeight
  ctx.fillStyle = "rgba(150,150,150,0.9)"
  ctx.fillRect(0, 0, cnv.width, cnv.height)
  ctx.font = "30px Helvetica"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return
    const value = input.value
    if (value.replace(/[^a-zA-Z]/g, "").length <= 0) return

    wordBlocks[value] = { text: value, x: cnv.width / 2, y: cnv.height / 2 }
    const allSentences = Object.keys(wordBlocks).map((key) => {
      return wordBlocks[key].text
    })
    const combinedString = allSentences.join("\n")
    input.value = ""
    updateWordsPositions(combinedString)
  })
  render()
}

const updateWordsPositions = async (combinedString: string) => {
  const embeddingResult = await fetchEmbedding(combinedString)
  if (Object.keys(wordBlocks).length < 2) return
  findUmap(embeddingResult)
}

const render = () => {
  if (!(cnv && ctx && input)) return
  ctx.fillStyle = "rgba(150,150,150,0.9)"
  ctx.fillRect(0, 0, cnv.width, cnv.height)
  ctx.fillStyle = "black"

  if (!Object.keys(wordBlocks)) return
  Object.keys(wordBlocks).forEach((key) => {
    const word = wordBlocks[key]
    const text = word.text
    ctx.fillText(text, word.x, word.y)
    if (!(word.xTarget && word.yTarget)) return
    word.x = lerp(word.x, word.xTarget, 0.1)
    word.y = lerp(word.y, word.yTarget, 0.1)
  })
  window.requestAnimationFrame(render)
}

const findUmap = (parsedResponse: any) => {
  const output: { embedding: number[]; input: string }[] = parsedResponse.output
  const embeddings = output.map((point) => point.embedding)
  const myrng = seedrandom("hello.")
  const umap = new UMAP({
    nNeighbors: Object.keys(wordBlocks).length - 1,
    minDist: 0.1,
    nComponents: 2,
    random: myrng,
    spread: 0.99,
  })
  const fittings = umap.fit(embeddings)
  const normalizedFittings = normalize(fittings)
  normalizedFittings.forEach((vertex, index) => {
    const key = output[index].input
    wordBlocks[key].xTarget = vertex[0] * cnv.width * 0.8 + cnv.width * 0.1
    wordBlocks[key].yTarget = vertex[1] * cnv.height * 0.8 + cnv.height * 0.1
  })
  console.log(wordBlocks)
}

const normalize = (arrayOfNumbers: number[][]) => {
  let max = [0, 0]
  let min = [0, 0]
  for (let i = 0; i < arrayOfNumbers.length; i++) {
    for (let j = 0; j < 2; j++) {
      if (arrayOfNumbers[i][j] > max[j]) {
        max[j] = arrayOfNumbers[i][j]
      }
      if (arrayOfNumbers[i][j] < min[j]) {
        min[j] = arrayOfNumbers[i][j]
      }
    }
  }
  const normalizedArr = arrayOfNumbers.map((numbers) => {
    const num1 = (numbers[0] - min[0]) / (max[0] - min[0])
    const num2 = (numbers[1] - min[1]) / (max[1] - min[1])
    return [num1, num2]
  })
  return normalizedArr
}

init()
