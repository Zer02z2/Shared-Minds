import { fetchEmbedding } from "./fetch"
import { UMAP } from "umap-js"
import seedrandom from "seedrandom"

const cnv = document.getElementById("canvas")
const input = document.getElementById("input-field") as HTMLInputElement

interface WordBlock {
  text: string
}
interface WordBlocks {
  [name: string]: WordBlock
}

const wordBlocks: WordBlocks = {}

const init = () => {
  if (!(cnv && input)) return

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
    console.log(combinedString)
  })
}

init()

const update = async (input: string) => {
  const embeddingResult = await fetchEmbedding(input)
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
