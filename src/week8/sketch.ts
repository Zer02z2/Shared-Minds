import { fetchEmbedding } from "./fetch"

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
  const embedding = await fetchEmbedding(input)
  console.log(embedding)
}
