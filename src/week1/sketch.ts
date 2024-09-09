import { getElementPosition, Random } from "../library"
import { Paint } from "./paint"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")
const input = document.getElementById("input-field") as HTMLInputElement

const init = (): void => {
  if (!(ctx && input)) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  ctx.fillStyle = "rgba(150,150,150,0.9)"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  input.style.left = "2vw"
  input.style.top = "5vh"
  let [x, y] = getElementPosition(input)

  Paint.init()

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const value = input.value
      const words = value.split(/(\s+|(?=\.)|(?<=\.)|\b)/).filter(Boolean)

      words.forEach((word) => {
        if (word === ".") {
          x = Random.float(10, 50)
          y += 80
          Paint.endSentence()
          return
        }
        if (!/[a-zA-Z]/.test(word)) return

        const randomY = y + Random.float(-20, 20)
        Paint.addWord(word, x, randomY)
        x += word.length * 30 + Random.float(20, 50)
      })
      ctx.fillStyle = "black"
      ctx.font = "30px Helvetica"
      Paint.render(ctx)

      input.value = ""
      input.style.left = `${x}px`
      input.style.top = `${y}px`
    }
  })
}

init()
