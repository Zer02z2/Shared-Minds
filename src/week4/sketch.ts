import { getDatabase, ref, onValue, set } from "firebase/database"
import { initializeApp } from "firebase/app"
import { secrets } from "../secrets"
import { updateLocker } from "./locker"

export interface Data {
  id: string
  status: "opened" | "closed" | "occupied" | "locked"
  time: number | null
}

const lockers = [...document.getElementsByClassName("grid")] as HTMLElement[]
initializeApp(secrets.firebaseConfig)
const db = getDatabase()

export const writeData = (data: Data) => {
  set(ref(db, `locker/${data.id}`), {
    id: data.id,
    status: data.status,
    time: data.time,
  })
}

const init = () => {
  if (!lockers) return
  const lockerData: { data: Data; target: HTMLElement }[] = lockers.map(
    (locker) => {
      return {
        data: { id: locker.id, status: "closed", time: null },
        target: locker,
      }
    }
  )

  onValue(ref(db, "locker"), (snapshot) => {
    const data: Data[] = snapshot.val()
    lockerData.forEach((info) => {
      const record = data.find((obj) => {
        try {
          if (obj.id === info.data.id) return true
        } catch {
          return false
        }
      })
      if (record) info.data = record
      else writeData(info.data)
      //writeData(info.data)
      updateLocker(info.target, info.data)
    })
  })
}

init()
