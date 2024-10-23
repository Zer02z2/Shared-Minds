import fullAppleUrl from "./fullApple.jpg"
import eatenAppleUrl from "./eatenApple.jpg"

const url = "https://liked-crappie-simply.ngrok-free.app"

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
    if (typeof base64 === "string") return base64
    throw new Error("Base64 is not a string")
  } catch (error) {
    console.log(error)
  }
}

const preload = async () => {
  const a = await convertImgToBase64(fullAppleUrl)
  console.log(a)
}
preload()
