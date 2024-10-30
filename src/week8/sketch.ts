import { fetchEmbedding } from "./fetch"
import { UMAP } from "umap-js"
import seedrandom from "seedrandom"

const cnv = document.getElementById("canvas") as HTMLCanvasElement
const ctx = cnv.getContext("2d")
const input = document.getElementById("input-field") as HTMLInputElement
if (!(cnv && ctx && input)) return

interface WordBlock {
  text: string
  x?: number
  y?: number
  xTarget?: number
  yTarget?: number
}
interface WordBlocks {
  [name: string]: WordBlock
}

const wordBlocks: WordBlocks = {}

const init = () => {
  ctx.fillStyle = "rgba(150,150,150,0.9)"
  ctx.fillRect(0, 0, cnv.width, cnv.height)
  ctx.font = "20px Helvetica"
  ctx.fillStyle = "black"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return
    const value = input.value
    if (value.replace(/[^a-zA-Z]/g, "").length <= 0) return
    wordBlocks[value] = { text: value }
    const allSentences = Object.keys(wordBlocks).map((key) => {
      return wordBlocks[key].text
    })
    const combinedString = allSentences.join("\n")
    input.value = ""
    update(combinedString)
  })
}

init()

const update = async (value: string) => {
  const embeddingResult = await fetchEmbedding(value)
  wordBlocks[value].x = 1
  if (Object.keys(wordBlocks).length < 2) return
  findUmap(embeddingResult)
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
  console.log(normalizedFittings)
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
