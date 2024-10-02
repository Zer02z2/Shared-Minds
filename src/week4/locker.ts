import { HTMLElement, removeChildren } from "../library"
import { Data } from "./sketch"

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

  container.appendChild(img)
  container.appendChild(timerDiv)
  container.appendChild(button)
  removeChildren(target)
  target.appendChild(container)
}
