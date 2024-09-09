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
window.localStorage.clear()

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

      const words = value.split(/(\s+|(?=\.)|(?<=\.)|\b)/).filter(Boolean)

      words.forEach((word) => {
        if (word === ".") {
          window.localStorage.removeItem("lastWord")
          return
        }

        const lastWord = window.localStorage.getItem("lastWord")
        if (!dict[word]) {
          const [x, y] = getElementPosition(input)
          dict[word] = { occurrence: 1, x: x, y: y }
          ctx.fillText(word, x, y)

          if (lastWord) {
            line(ctx, dict[lastWord].x, dict[lastWord].y, x, y)
          }
        } else {
          dict[word].occurrence++
          if (lastWord) {
            line(
              ctx,
              dict[lastWord].x,
              dict[lastWord].y,
              dict[word].x,
              dict[word].y
            )
          }
        }
        window.localStorage.setItem("lastWord", word)

        input.style.left = `${Random.integer(10, 90)}vw`
        input.style.top = `${Random.integer(10, 90)}vh`
      })
      input.value = ""
    }
  })
}

init()
