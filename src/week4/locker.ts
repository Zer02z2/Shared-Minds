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
  if (data.time) {
    updateTimer(data.id, timer, data.time)
  }

  const button = HTMLElement.createButton(
    options[data.status].text,
    `button ${options[data.status].class}`
  )

  button.addEventListener("click", () => {
    switch (data.status) {
      case "closed":
        revealReality(data.id)
        break
      case "opened":
        addCat(data.id)
        break
    }
  })

  container.appendChild(img)
  container.appendChild(timerDiv)
  container.appendChild(button)
  removeChildren(target)
  target.appendChild(container)
}

const addCat = (id: Data["id"]) => {
  writeData({ id: id, status: "occupied", time: null })
  setTimeout(() => {
    const time = Date.now() + 5 * 1000
    writeData({ id: id, status: "locked", time: time })
  }, 1000)
}

const updateTimer = (
  id: Data["id"],
  timer: HTMLElement,
  unlockTime: number
) => {
  const timeNow = Date.now()
  const timeDifference = unlockTime - timeNow

  if (timeDifference <= 0) {
    writeData({ id: id, status: "closed", time: null })
    return
  }

  const minutes = Math.floor(timeDifference / 1000 / 60)
  const seconds = Math.floor(timeDifference / 1000 - minutes * 60)
  const min = minutes < 10 ? `0${minutes.toString()}` : minutes.toString()
  const sec = seconds < 10 ? `0${seconds.toString()}` : seconds.toString()
  timer.innerHTML = `${min}:${sec}`

  setTimeout(() => {
    updateTimer(id, timer, unlockTime)
  }, 500)
}

const revealReality = (id: Data["id"]) => {
  const number = Math.random()
  if (number < 0.5) {
    addCat(id)
  } else {
    writeData({ id: id, status: "opened", time: null })
  }
}
