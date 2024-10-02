import { getDatabase, ref, onValue, set, push, remove } from "firebase/database"
import { initializeApp } from "firebase/app"
import { secrets } from "../secrets"

const lockers = [...document.getElementsByClassName("grid")]

export interface Data {
  status: "opened" | "closed" | "occupied"
  time: number | null
}

const init = () => {
  if (!lockers) return
  const lockerData: { [id: string]: { data: Data } } = {}
  lockers.forEach((locker) => {
    lockerData[locker.id] = { data: { status: "closed", time: null } }
  })

  initializeApp(secrets.firebaseConfig)

  const db = getDatabase()
  onValue(ref(db, "locker"), (snapshot) => {
    const data = snapshot.val()
    console.log(data)
  })

  const writeData = (id: string, data: Data) => {
    set(ref(db, `locker/${id}`), {
      status: data.status,
      time: data.time,
    })
  }
  writeData("1", { status: "opened", time: null })
}

init()
