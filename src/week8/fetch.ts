import { wordsPrompt, Data, embeddingPrompt, sentencePrompt } from "./prompts"

const url = "https://replicate-api-proxy.glitch.me/create_n_get/"

export const fetchWords = async (banList: string[]) => {
  try {
    const result = await fetchData(wordsPrompt(banList))
    if (typeof result !== "string") throw new Error()
    const wordArr = result.split(/[^a-zA-Z]+/)
    if (wordArr.length !== 2) {
      throw new Error()
    }
    return wordArr
  } catch {
    alert("fetch words failed")
  }
}

export const fetchSentence = async (words: string[], numberOfWords: number) => {
  try {
    const result: { embedding: number[][]; input: string } = await fetchData(
      sentencePrompt(words, numberOfWords)
    )
    if (typeof result !== "string") throw new Error()
    return result
  } catch {
    alert("fetch words failed")
  }
}

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
