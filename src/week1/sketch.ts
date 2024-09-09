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

  input.style.left = "2vw"
  input.style.top = "5vh"
  let [x, y] = getElementPosition(input)
  console.log(x)

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const value = input.value
      const words = value.split(/(\s+|(?=\.)|(?<=\.)|\b)/).filter(Boolean)

      words.forEach((word) => {
        if (word === ".") {
          window.localStorage.removeItem("lastWord")
          x = Random.float(10, 50)
          y += 80
          return
        }

        if (!/[a-zA-Z]/.test(word)) return

        const lastWord = window.localStorage.getItem("lastWord")
        if (!dict[word]) {
          const randomY = y + Random.float(-20, 20)
          dict[word] = { occurrence: 1, x: x, y: randomY }

          ctx.fillStyle = "black"
          ctx.font = "30px Helvetica"
          ctx.fillText(word, x, randomY)

          if (lastWord) {
            line(ctx, dict[lastWord].x, dict[lastWord].y, x, randomY)
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
        x += word.length * 30 + Random.float(20, 50)
      })
      input.value = ""
      input.style.left = `${x}px`
      input.style.top = `${y}px`
    }
  })
}

init()
