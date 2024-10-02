import { HTMLElement, removeChildren } from "../library"
import { Data, LockerInfo, writeData } from "./sketch"

const options = {
  opened: {
    src: "/shared-minds/locker/opened.jpg",
    text: "Summon cat",
    class: "opened",
  },
  locked: {
    src: "/shared-minds/locker/closed.jpg",
    text: "Open",
    class: "locked",
  },
  closed: {
    src: "/shared-minds/locker/closed.jpg",
    text: "Open",
    class: "closed",
  },
  occupied: {
    src: "/shared-minds/locker/cat.jpg",
    text: "Open",
    class: "locked",
  },
}

export const updateLocker = (info: LockerInfo) => {
  const { target, data } = info
  const { id, status, time } = data
  const container = HTMLElement.createDiv("locker-container")
  const img = HTMLElement.createImage(
    options[status].src,
    "locker image",
    "locker"
  )
  const timerDiv = HTMLElement.createDiv("timer-container")
  const timer = HTMLElement.createText("p", "", "timer")
  timerDiv.appendChild(timer)
  if (time) {
    updateTimer(id, timer, time)
  }

  const button = HTMLElement.createButton(
    options[status].text,
    `button ${options[status].class}`
  )

  button.addEventListener("click", () => {
    switch (status) {
      case "closed":
        revealReality(id)
        break
      case "opened":
        addCat(id)
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
    const time = Date.now() + 60 * 60 * 1000
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
