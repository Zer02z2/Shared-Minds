import { HTMLElement, removeChildren } from "../library"
import { secrets } from "../secrets"

const input = document.getElementById("input-field") as HTMLInputElement
const myWordsBox = document.getElementById("my-words")
const aiWordsBox = document.getElementById("ai-words")
const trashCan = document.getElementById("trash")

const init = () => {
  let dict: string[] = []
  let history: string = ""
  if (!(input && myWordsBox && aiWordsBox && trashCan)) {
    console.error("Counldn't load all elements")
    return
  }

  trashCan.addEventListener("click", () => {
    location.reload()
  })

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const values = input.value.split(/\s/).filter(Boolean)
      input.value = ""
      if (values.length === 0) return
      values.forEach((value) => {
        const word = value.replace(/[^a-zA-Z]/g, "").toLowerCase()
        if (dict.includes(word)) return
        else dict = [...dict, word]
      })

      history += ` ${values.join(" ")}`
      const newLine = HTMLElement.createText("p", values.join(" "))
      myWordsBox.appendChild(newLine)

      const update = async () => {
        history = await fetchData(history)
        removeChildren(aiWordsBox)
        const aiWordsArr = history.split(" ")
        aiWordsArr.forEach((word) => {
          const testWord = word.replace(/[^a-zA-Z]/g, "").toLocaleLowerCase()
          const className = dict.includes(testWord) ? "recorded" : "unrecorded"
          const span = HTMLElement.createText("span", `${word} `, className)
          aiWordsBox.appendChild(span)
        })
      }
      update()
    }
  })
}

const fetchData = async (input: string) => {
  const prompt = `Rearrange the following words or sentences to make them coherent together. Make sure your response is in complete sentence or sentences. Avoid adding new words, but you can add new words if the sentence is not complete. Changes should be minimal, and try not to change the overall meaning. Add a + sign at the beginning and end of your response: ${input}`
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
  console.log("Start fetching")
  const response = await fetch(secrets.replicateProxy, options)
  const parsedResponse = await response.json()
  if (parsedResponse.output) {
    const result = parsedResponse.output
      .join("")
      .match(/\+([^+]+)\+/)[1]
      .trim()
    console.log("Got it!")
    return result
  } else {
    console.log("Oh no...")
    return ""
  }
}

init()
