import { secrets } from "../secrets"
import {
  choicePrompt,
  Data,
  imagePrompt,
  initialPrompt,
  storyPrompt,
  translatePrompt,
} from "./prompts"

export const getOptions = async (
  input: string,
  params: { mode: "init" | "update"; language: string }
) => {
  const getShortChoice = async () => {
    const data =
      params.mode === "init"
        ? initialPrompt({ language: params.language })
        : storyPrompt(input, { language: params.language })
    const fullChoice = await fetchData(data)
    const shortChoice = await fetchData(
      choicePrompt(fullChoice, { language: params.language })
    )
    return { fullChoice: fullChoice, shortChoice: shortChoice }
  }
  const options = await Promise.all(
    Array.from({ length: 3 }).map(() => getShortChoice())
  )
  return options
}

export const getImage = async (input: string, params: { language: string }) => {
  const englishPrompt =
    params.language === "English"
      ? input
      : await fetchData(translatePrompt(input))
  const shortPrompt = await fetchData(
    choicePrompt(englishPrompt, { language: "English" })
  )
  const src = await fetchData(imagePrompt(shortPrompt))
  return src
}

export const fetchData = async (data: Data[keyof Data]): Promise<string> => {
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
    const response = await fetch(secrets.replicateProxy, options)
    const parsedResponse = await response.json()
    let result: string
    switch (data["type"]) {
      case "text":
        result = parsedResponse.output
          .join("")
          .match(/\+([^+]+)\+/)[1]
          .trim()
        console.log("Got text!")
        break
      case "image":
        result = parsedResponse.output
        console.log("Got image!")
        break
    }
    return result
  } catch {
    console.log("Trying again...")
    return fetchData(data)
  }
}
