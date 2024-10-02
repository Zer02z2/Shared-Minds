import { HTMLElement, removeChildren } from "../library"
import { Data, writeData } from "./sketch"

const options = {
  opened: { src: "./locker/opened.jpg", text: "Summon cat", class: "opened" },
  locked: { src: "./locker/closed.jpg", text: "Open", class: "locked" },
  closed: { src: "./locker/closed.jpg", text: "Open", class: "closed" },
  occupied: { src: "./locker/cat.jpg", text: "Open", class: "locked" },
}

export const updateLocker = (target: HTMLElement, data: Data) => {
  const container = HTMLElement.createDiv("locker-container")
  const img = HTMLElement.createImage(
    options[data.status].src,
    "locker image",
    "locker"
  )
  const timerDiv = HTMLElement.createDiv("timer-container")
  const timer = HTMLElement.createText("p", "", "timer")
  timerDiv.appendChild(timer)

  const button = HTMLElement.createButton(
    options[data.status].text,
    `button ${options[data.status].class}`
  )

  button.addEventListener("click", () => {
    switch (data.status) {
      case "closed":
        writeData({ id: data.id, status: "opened", time: null })
        break
      case "opened":
        writeData({ id: data.id, status: "locked", time: null })
        break
      case "locked":
        writeData({ id: data.id, status: "closed", time: null })
    }
  })

  container.appendChild(img)
  container.appendChild(timerDiv)
  container.appendChild(button)
  removeChildren(target)
  target.appendChild(container)
}
