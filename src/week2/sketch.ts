import { HTMLText } from "../library"
import { secrets } from "../secrets"

const input = document.getElementById("input-field") as HTMLInputElement
const myWordsBox = document.getElementById("left-column")
const aiWordsBox = document.getElementById("ai-words")
const prompt1 =
  "Generate four words that are closely associated with the following words or sentences. Add a + sign at the beginning and end of your response: "
const prompt2 =
  "Rearrange the following words or sentences to make them coherent together. Avoid adding new words, but you can add new words if the sentence is not complete. Changes should be minimal, and try not to change the overall meaning. Add a + sign at the beginning and end of your response: "

const init = () => {
  let dict: { [name: string]: string }
  let history: string = ""
  if (!(input && myWordsBox && aiWordsBox)) {
    console.error("Counldn't load all elements")
    return
  }

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const value = input.value.split(/\s/).filter(Boolean)
      input.value = ""
      if (value.length === 0) return

      history += ` ${value.join(" ")}`
      const newLine = HTMLText.create("p", value.join(" "))
      myWordsBox.appendChild(newLine)

      const update = async () => {
        history = await fetchData(history)
        aiWordsBox.innerHTML = history
      }
      update()
    }
  })
}

const fetchData = async (input: string) => {
  const prompt = prompt1 + input
  const data = {
    version: "fbfb20b472b2f3bdd101412a9f70a0ed4fc0ced78a77ff00970ee7a2383c575d",
    input: {
      prompt: prompt,
    },
  }
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  }
  console.log("start fetching")
  const response = await fetch(secrets.replicateProxy, options)
  const parsedResponse = await response.json()
  if (parsedResponse.output) {
    const result = parsedResponse.output
      .join("")
      .match(/\+([^+]+)\+/)[1]
      .trim()
    console.log(result)
    return result
  } else return ""
}

init()
