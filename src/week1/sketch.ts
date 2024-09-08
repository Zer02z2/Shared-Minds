import { getElementPosition, Random } from "../library"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")
const input = document.getElementById("input-field") as HTMLInputElement

const init = (): void => {
  if (!(ctx && input)) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  ctx.fillStyle = "rgba(150,150,150,0.9)"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = "black"
  ctx.font = "30px Helvetica"
  ctx.fillText("test", 400, 400)

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const value = input.value
      const [x, y] = getElementPosition(input)
      console.log(value, x, y)
      ctx.fillText(value, x, y)
      input.value = ""

      const [x2, y2] = [Random.integer(10, 90), Random.integer(10, 90)]
      input.style.left = `${x2}vw`
      input.style.top = `${y2}vh`
    }
  })
}

init()
