import { HTMLElement, removeChildren } from "../library"
import { fetchData, getImage, getOptions } from "./fetch"
import { storyPrompt } from "./prompts"

const input = document.getElementById("input-field") as HTMLTextAreaElement
const story = document.getElementById("story")
const optionContainer = document.getElementById("option")
const trashCan = document.getElementById("trash")
const loader = document.getElementById("loader")
const gallery = document.getElementById("gallery")
const leftColumn = document.getElementById("left-column")
const languageSelector = document.getElementById(
  "language-selector"
) as HTMLSelectElement

const init = () => {
  let fullStory: string[] = []
  let imageArr: string[] = []
  let language: string = localStorage.getItem("language") || "English"
  console.log(language)
  if (
    !(
      input &&
      story &&
      optionContainer &&
      trashCan &&
      loader &&
      gallery &&
      languageSelector &&
      leftColumn
    )
  ) {
    alert("Couldn't load all resources.")
    return
  }
  trashCan.addEventListener("click", () => {
    location.reload()
  })
  languageSelector.value = language
  languageSelector.addEventListener("change", () => {
    localStorage.setItem("language", languageSelector.value)
    location.reload()
  })

  const appendToStory = (e: HTMLElement) => {
    story.appendChild(e)
    if (story.scrollHeight > story.clientHeight) {
      story.scrollTo({ top: story.scrollHeight, behavior: "smooth" })
    }
  }

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return
    if (input.value.length === 0) return
    const values = input.value
    event.preventDefault()
    input.value = ""

    fullStory = [...fullStory, values]
    const paragraph = HTMLElement.createText("p", values, "my-story")
    appendToStory(paragraph)

    update(fullStory)
  })
  const update = async (input: string[]) => {
    removeChildren(optionContainer)
    loader.style.display = "block"
    const story = input.join(" ")
    const newParagraph = await fetchData(
      storyPrompt(story, { language: language })
    )
    updateImage(newParagraph)
    await updateOptions(newParagraph, { mode: "update" })
    const paragraph = HTMLElement.createText(
      "p",
      ` ${newParagraph}`,
      "story-block"
    )
    appendToStory(paragraph)
    fullStory = [...fullStory, newParagraph]
  }

  const updateImage = async (input: string) => {
    const context = fullStory[fullStory.length - 1]
      ? fullStory[fullStory.length - 1]
      : ""
    const prompt = `${context} ${input}`
    const src = await getImage(prompt, { language: language })
    imageArr = [...imageArr, src]
    const img = HTMLElement.createImage(
      src,
      "AI generated image.",
      "story-image"
    )
    img.onload = () => {
      const outerContainer = HTMLElement.createDiv("image-outer-container")
      const innerContainer = HTMLElement.createDiv("image-inner-container")
      innerContainer.appendChild(img)
      outerContainer.appendChild(innerContainer)
      gallery.appendChild(outerContainer)

      const size = leftColumn.clientWidth
      gallery.style.transform = `translateX(${-size * imageArr.length}px)`
    }
  }

  const updateOptions = async (
    input: string,
    params: { mode: "init" | "update" }
  ) => {
    console.log("hi")
    const options = await getOptions(input, {
      mode: params.mode,
      language: language,
    })
    loader.style.display = "none"
    options.forEach((option) => {
      const choice = HTMLElement.createText(
        "p",
        `${option.shortChoice}`,
        "option"
      )
      choice.addEventListener("click", () => {
        fullStory = [...fullStory, option.fullChoice]
        const paragraph = HTMLElement.createText(
          "p",
          `${option.fullChoice}`,
          "my-story"
        )
        appendToStory(paragraph)
        update(fullStory)
      })
      optionContainer.appendChild(choice)
    })
  }

  updateImage("A path leading to multiple universes.")
  updateOptions("", { mode: "init" })
}

init()
