import { HTMLElement, removeChildren } from "../library"
import { Data } from "./sketch"

const values = {
  opened: "Summon cat",
  closed: "Open",
  occupied: "Open",
}

export const updateLocker = (target: HTMLElement, data: Data) => {
  const container = HTMLElement.createDiv("locker-container")
  const img = HTMLElement.createImage(
    `./locker/${data.status}.jpg`,
    "locker image",
    "locker"
  )
  const timerDiv = HTMLElement.createDiv("timer-container")
  const timer = HTMLElement.createText("p", "", "timer")
  timerDiv.appendChild(timer)

  const button = HTMLElement.createButton(values[data.status], "button")

  container.appendChild(img)
  container.appendChild(timerDiv)
  container.appendChild(button)
  removeChildren(target)
  target.appendChild(container)
}
