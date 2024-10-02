import { getDatabase, ref, onValue, set } from "firebase/database"
import { initializeApp } from "firebase/app"
import { secrets } from "../secrets"
import { updateLocker } from "./locker"

const lockers = [...document.getElementsByClassName("grid")] as HTMLElement[]

export interface Data {
  id: string
  status: "opened" | "closed" | "occupied" | "locked"
  time: number | null
}

initializeApp(secrets.firebaseConfig)
const db = getDatabase()

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

export const writeData = (data: Data) => {
  set(ref(db, `locker/${data.id}`), {
    id: data.id,
    status: data.status,
    time: data.time,
  })
}
