import { getElementPosition, Random } from "../library"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")
const inputContainer = document.getElementById("input-container") as HTMLElement
const input = document.getElementById("input-field") as HTMLInputElement

const init = (): void => {
  if (!(ctx && input)) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  let [inputX, inputY] = getElementPosition(inputContainer)
  const fontSize = 30

  const render = (): void => {
    ctx.fillStyle = "rgba(150,150,150,0.9)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = `${fontSize}px Helvetica`
  }

  render()

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const value = input.value
      const words = value.split(/[^a-zA-Z]+/).filter(Boolean)

      words.forEach((word) => {})
      render()

      input.value = ""
      inputContainer.style.left = `${inputX}px`
      inputContainer.style.top = `${inputY}px`
    }
  })
}

init()
