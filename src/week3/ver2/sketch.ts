import { HTMLElement, removeChildren } from "../../library"
import { fetchData, getImage, getOptions } from "../fetch"
import { storyPrompt } from "../prompts"

const input = document.getElementById("input-field") as HTMLTextAreaElement
const optionContainer = document.getElementById("option")
const trashCan = document.getElementById("trash")
const loader = document.getElementById("loader")
const gallery = document.getElementById("gallery")
const topColumn = document.getElementById("top-column")
const imageContainers = document.getElementsByClassName("image-outer-container")
const leftArrow = document.getElementById("left-bg")
const rightArrow = document.getElementById("right-bg")
const languageSelector = document.getElementById(
  "language-selector"
) as HTMLSelectElement

const init = () => {
  if (
    !(
      input &&
      optionContainer &&
      trashCan &&
      loader &&
      gallery &&
      topColumn &&
      leftArrow &&
      rightArrow &&
      languageSelector &&
      imageContainers
    )
  ) {
    alert("Couldn't load all resources.")
    return
  }
  let fullStory: string[] = []
  let numOfImage: number = 0
  let currentImage: number = 0
  let language: string = localStorage.getItem("language") || "English"

  languageSelector.value = language
  languageSelector.addEventListener("change", () => {
    localStorage.setItem("language", languageSelector.value)
    location.reload()
  })

  trashCan.addEventListener("click", () => {
    location.reload()
  })

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return
    if (input.value.length === 0) return
    const values = input.value
    event.preventDefault()
    input.value = ""

    fullStory = [...fullStory, values]

    update(fullStory)
  })

  leftArrow.addEventListener("click", () => {
    currentImage--
    updateArrows()
    moveGallery()
  })
  rightArrow.addEventListener("click", () => {
    currentImage++
    updateArrows()
    moveGallery()
  })

  window.addEventListener("resize", () => {
    moveGallery()
  })

  const update = async (input: string[]) => {
    removeChildren(optionContainer)
    loader.style.display = "block"
    const story = input.join(" ")
    const newParagraph = await fetchData(
      storyPrompt(story, { language: language })
    )
    const [img] = await Promise.all([
      updateImage(newParagraph),
      updateOptions(newParagraph, { mode: "update" }),
    ])
    img.onload = () => {
      const outerContainer = HTMLElement.createDiv("image-outer-container")
      const innerContainer = HTMLElement.createDiv("image-inner-container")

      fullStory = [...fullStory, newParagraph]
      const length = fullStory.length
      const paragraph = HTMLElement.createText(
        "p",
        `${fullStory[length - 1]} ${fullStory[length - 2]}`,
        "story-block"
      )
      innerContainer.appendChild(img)
      outerContainer.appendChild(innerContainer)
      outerContainer.appendChild(paragraph)
      gallery.appendChild(outerContainer)

      numOfImage++
      currentImage = numOfImage
      moveGallery()
      updateArrows()
    }
  }

  const updateImage = async (input: string) => {
    const context = fullStory[fullStory.length - 1]
      ? fullStory[fullStory.length - 1]
      : ""
    const prompt = `${context} ${input}`
    const src = await getImage(prompt, { language: language })
    const img = HTMLElement.createImage(
      src,
      "AI generated image.",
      "story-image"
    )
    return img
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
        update(fullStory)
      })
      optionContainer.appendChild(choice)
    })
  }

  const moveGallery = () => {
    const size = imageContainers[0].clientWidth
    gallery.style.transform = `translateX(${-size * currentImage}px)`
  }

  const updateArrows = () => {
    leftArrow.style.opacity = currentImage >= 2 ? "1" : "0"
    leftArrow.style.pointerEvents = currentImage >= 2 ? "auto" : "none"
    rightArrow.style.opacity = currentImage < numOfImage ? "1" : "0"
    rightArrow.style.pointerEvents = currentImage < numOfImage ? "auto" : "none"
  }

  updateImage("A path leading to multiple universes.")
  updateOptions("", { mode: "init" })
}

init()
