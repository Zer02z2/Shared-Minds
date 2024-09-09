import { getElementPosition, Random } from "../library"
import { Paint } from "./components/paint"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")
const input = document.getElementById("input-field") as HTMLInputElement

const init = (): void => {
  if (!(ctx && input)) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  let [inputX, inputY] = getElementPosition(input)
  const fontSize = 30

  const render = (): void => {
    ctx.fillStyle = "rgba(150,150,150,0.9)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = `${fontSize}px Helvetica`
    Paint.render(ctx)
  }

  Paint.init()
  render()

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const value = input.value
      const words = value.split(/(\s+|(?=\.)|(?<=\.)|\b)/).filter(Boolean)

      words.forEach((word) => {
        if (word === ".") {
          Paint.endSentence()
          inputX = Random.float(10, 50)
          inputY += 80
          return
        }
        if (!/[a-zA-Z]/.test(word)) return
        const randomY = inputY + Random.float(-20, 20)
        Paint.addWord(word, inputX, randomY)
        inputX += word.length * 30 + Random.float(20, 50)
      })
      render()

      input.value = ""
      input.style.left = `${inputX}px`
      input.style.top = `${inputY}px`
    }
  })

  document.addEventListener("mousemove", (event) => {
    const [mouseX, mouseY] = [event.clientX, event.clientY]
    if (Paint.checkHover(mouseX, mouseY, fontSize)) render()
  })
}

init()
