import { HTMLText } from "../library"
import { secrets } from "../secrets"
import { choicePrompt, data, storyPrompt } from "./prompts"

const input = document.getElementById("input-field") as HTMLTextAreaElement
const story = document.getElementById("story")
const trashCan = document.getElementById("trash")

const init = () => {
  let history: string = ""
  if (!(input && story && trashCan)) {
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
    story.appendChild(HTMLText.create("p", values, "my-story"))
    story.scrollTop = story.scrollHeight

    const update = async () => {
      const newStory = await fetchData(storyPrompt(history))
      getOptions(newStory)
      const span = HTMLText.create("span", ` ${newStory}`, "story-block")
      story.appendChild(span)
      story.scrollTop = story.scrollHeight
      history += newStory
    }
    const getOptions = async (story: string) => {
      const getShortChoice = async () => {
        const fullChoice = await fetchData(storyPrompt(story))
        const shortChoice = await fetchData(choicePrompt(fullChoice))
        return { fullChoice: fullChoice, shortChoice: shortChoice }
      }
      const [option1, option2, option3] = await Promise.all([
        getShortChoice(),
        getShortChoice(),
        getShortChoice(),
      ])
      console.log(option1, option2, option3)
    }
    update()
  })
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
