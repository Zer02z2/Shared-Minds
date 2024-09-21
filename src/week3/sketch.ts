import { HTMLText, removeChildren } from "../library"
import { secrets } from "../secrets"
import { choicePrompt, data, storyPrompt } from "./prompts"

const input = document.getElementById("input-field") as HTMLTextAreaElement
const story = document.getElementById("story")
const optionContainer = document.getElementById("option-container")
const trashCan = document.getElementById("trash")

const init = () => {
  let history: string = ""
  if (!(input && story && optionContainer && trashCan)) {
    console.error("Counldn't load all elements")
    return
  }

  trashCan.addEventListener("click", () => {
    location.reload()
  })

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return
    if (input.value.length === 0) return
    const values = input.value
    event.preventDefault()
    input.value = ""

    history += values
    const paragraph = HTMLText.create("p", values, "my-story")
    appendToStory(paragraph)

    update(history)
  })

  const appendToStory = (e: HTMLElement) => {
    story.appendChild(e)
    if (story.scrollHeight > story.clientHeight) {
      story.scrollTo({ top: story.scrollHeight, behavior: "smooth" })
    }
  }

  const update = async (input: string) => {
    const newStory = await fetchData(storyPrompt(input))
    getOptions(newStory)
    const paragraph = HTMLText.create("p", ` ${newStory}`, "story-block")
    appendToStory(paragraph)
    history += newStory
  }

  const getOptions = async (input: string) => {
    const getShortChoice = async () => {
      const fullChoice = await fetchData(storyPrompt(input))
      const shortChoice = await fetchData(choicePrompt(fullChoice))
      return { fullChoice: fullChoice, shortChoice: shortChoice }
    }
    const options = await Promise.all(
      Array.from({ length: 3 }).map(() => getShortChoice())
    )
    options.forEach((option) => {
      const choice = HTMLText.create("p", `${option.shortChoice}`, "option")
      choice.addEventListener("click", () => {
        history += option.fullChoice
        const paragraph = HTMLText.create(
          "p",
          `${option.fullChoice}`,
          "my-story"
        )
        appendToStory(paragraph)
        removeChildren(optionContainer)
        update(history)
      })
      optionContainer.appendChild(choice)
    })
  }
}

const fetchData = async (data: data): Promise<string> => {
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
