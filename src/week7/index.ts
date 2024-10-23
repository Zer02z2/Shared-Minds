import fullAppleUrl from "./fullApple.jpg"
import eatenAppleUrl from "./eatenApple.jpg"

const slider = document.getElementById("slider") as HTMLInputElement
const gallery = document.getElementById("gallery")

let picture1Base64: string | undefined, picture2Base64: string | undefined

const preload = async () => {
  picture1Base64 = await convertImgToBase64(fullAppleUrl)
  picture2Base64 = await convertImgToBase64(eatenAppleUrl)
  init()
}

const init = () => {
  if (!(slider && gallery)) return
  console.log("init")
  slider.addEventListener("change", () => {
    console.log(slider.value)
  })
  fetchImage()
}

const fetchImage = async () => {
  const url = "https://dano.ngrok.dev/generateIt/"
  const data = {
    input: {
      prompt: "a half eaten apple",
      width: 512,
      height: 512,
      picture1: picture1Base64,
      picture2: picture2Base64,
    },
  }
  const options = {
    headers: {
      "Content-Type": `application/json`,
    },
    method: "POST",
    body: JSON.stringify(data),
  }
  console.log("start fetching")
  try {
    const response = await fetch(url, options)
    const result = await response.json()
    console.log(result)
  } catch (error) {}
}

const convertImgToBase64 = async (imgPath: string) => {
  try {
    const response = await fetch(imgPath)
    const blob = await response.blob()
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
    if (typeof base64 === "string") {
      const result = base64.split(",")[1]
      return result
    }
    throw new Error("Base64 is not a string")
  } catch (error) {
    console.log(error)
  }
}

preload()
