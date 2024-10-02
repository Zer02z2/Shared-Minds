import { getDatabase, ref, onValue, set, push, remove } from "firebase/database"
import { initializeApp } from "firebase/app"
import { secrets } from "../secrets"

initializeApp(secrets.firebaseConfig)

const db = getDatabase()
const lockerRef = ref(db, "locker")
onValue(lockerRef, (snapshot) => {
  const data = snapshot.val()
  console.log(data)
})

const writeData = () => {
  set(ref(db, `locker/1`), {
    status: "opened",
    time: 2000,
  })
}

writeData()

const removeData = () => {
  remove(lockerRef)
}

//removeData()
