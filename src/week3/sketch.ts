import { HTMLText, Random } from "../library"
import { secrets } from "../secrets"

const input = document.getElementById("input-field") as HTMLInputElement
const myWordsBox = document.getElementById("my-words")
const aiWordsBox = document.getElementById("ai-words")
const trashCan = document.getElementById("trash")

const init = () => {
  let history: string = ""
  if (!(input && myWordsBox && aiWordsBox && trashCan)) {
    console.error("Counldn't load all elements")
    return
  }

  trashCan.addEventListener("click", () => {
    location.reload()
  })

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return
    const values = input.value
    input.value = ""
    if (values.length === 0) return

    history += values
    myWordsBox.appendChild(HTMLText.create("p", values))
    aiWordsBox.appendChild(HTMLText.create("p", values))

    const update = async () => {
      const newStory = await fetchData(history)
      const span = HTMLText.create("span", ` ${newStory}`)
      aiWordsBox.appendChild(span)
      history += newStory
    }
    update()
  })
}

const fetchData = async (input: string): Promise<string> => {
  const promptOptions = [
    "twisting",
    "surprising",
    "peaceful",
    "exciting",
    "humorous",
    "lovely",
    "suspenful",
  ]
  const randomPrompt =
    promptOptions[Random.integer(0, promptOptions.length - 1)]
  const prompt = `Read the following story and expand upon it in one or two sentences. Your response should be no longer than 20 words. Make sure the logic of the story is smooth. The plot should be ${randomPrompt}. Add a + sign at the beginning and end of your response: ${input}`
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
