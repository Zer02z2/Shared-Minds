import { Data, embeddingPrompt } from "./prompts"

const url = "https://replicate-api-proxy.glitch.me/create_n_get/"

export const fetchEmbedding = async (input: string) => {
  try {
    const result = await fetchData(embeddingPrompt(input))
    return result
  } catch {
    alert("fetch embedding failed")
  }
}

export const fetchData = async (data: Data[keyof Data]) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data["data"]),
  }
  try {
    console.log("Start fetching")
    const response = await fetch(url, options)
    const parsedResponse = await response.json()
    if (data["type"] === "text") {
      return parseText(parsedResponse)
    }
    if (data["type"] === "embedding") {
      return parsedResponse
    }
    throw new Error()
  } catch (error) {
    console.log(error)
  }
}

const parseText = (parsedResponse: any) => {
  const result: string = parsedResponse.output
    .join("")
    .match(/\+([^+]+)\+/)[1]
    .trim()
  return result
}
