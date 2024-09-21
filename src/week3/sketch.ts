import { HTMLText, removeChildren } from "../library"
import { secrets } from "../secrets"
import { choicePrompt, data, initialPrompt, storyPrompt } from "./prompts"

const input = document.getElementById("input-field") as HTMLTextAreaElement
const story = document.getElementById("story")
const optionContainer = document.getElementById("option-container")
const trashCan = document.getElementById("trash")

const init = () => {
  let fullStory: string = ""
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

    fullStory += values
    const paragraph = HTMLText.create("p", values, "my-story")
    appendToStory(paragraph)

    update(fullStory)
  })

  const appendToStory = (e: HTMLElement) => {
    story.appendChild(e)
    if (story.scrollHeight > story.clientHeight) {
      story.scrollTo({ top: story.scrollHeight, behavior: "smooth" })
    }
  }

  const update = async (input: string) => {
    const newParagraph = await fetchData(storyPrompt(input))
    getOptions(newParagraph, { mode: "update" })
    const paragraph = HTMLText.create("p", ` ${newParagraph}`, "story-block")
    appendToStory(paragraph)
    fullStory += newParagraph
  }

  const getOptions = async (
    input: string,
    params: { mode: "init" | "update" }
  ) => {
    const getShortChoice = async () => {
      const data = params.mode === "init" ? initialPrompt() : storyPrompt(input)
      const fullChoice = await fetchData(data)
      const shortChoice = await fetchData(choicePrompt(fullChoice))
      return { fullChoice: fullChoice, shortChoice: shortChoice }
    }
    const options = await Promise.all(
      Array.from({ length: 3 }).map(() => getShortChoice())
    )
    options.forEach((option) => {
      const choice = HTMLText.create("p", `${option.shortChoice}`, "option")
      choice.addEventListener("click", () => {
        fullStory += option.fullChoice
        const paragraph = HTMLText.create(
          "p",
          `${option.fullChoice}`,
          "my-story"
        )
        appendToStory(paragraph)
        removeChildren(optionContainer)
        update(fullStory)
      })
      optionContainer.appendChild(choice)
    })
  }
  getOptions("", { mode: "init" })
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
  try {
    console.log("Start fetching")
    const response = await fetch(secrets.replicateProxy, options)
    const parsedResponse = await response.json()
    const result = parsedResponse.output
      .join("")
      .match(/\+([^+]+)\+/)[1]
      .trim()
    console.log("Got it!")
    return result
  } catch {
    console.log("Trying again...")
    return fetchData(data)
  }
}

init()
