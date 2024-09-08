import { getElementPosition, line, Random } from "../library"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")
const input = document.getElementById("input-field") as HTMLInputElement

interface Word {
  occurrence: number
  x: number
  y: number
}

let dict: { [word: string]: Word } = {}

const init = (): void => {
  if (!(ctx && input)) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  ctx.fillStyle = "rgba(150,150,150,0.9)"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = "black"
  ctx.font = "30px Helvetica"

  input.style.left = `${Random.integer(10, 90)}vw`
  input.style.top = `${Random.integer(10, 90)}vh`

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const value = input.value
      if (value === "") return

      const lastValue = window.localStorage.getItem("lastValue")

      if (!dict[value]) {
        const [x, y] = getElementPosition(input)
        dict[value] = { occurrence: 1, x: x, y: y }
        ctx.fillText(value, x, y)

        if (lastValue) {
          line(ctx, dict[lastValue].x, dict[lastValue].y, x, y)
        }
      }
      window.localStorage.setItem("lastValue", value)

      input.value = ""

      input.style.left = `${Random.integer(10, 90)}vw`
      input.style.top = `${Random.integer(10, 90)}vh`
    }
  })
}

init()
