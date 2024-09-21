import { Random } from "../library"

export interface data {
  version: string
  input: { prompt: string; system_prompt?: string }
}

export const storyPrompt = (input: string): data => {
  const promptOptions = [
    "twisting",
    "surprising",
    "peaceful",
    "exciting",
    "humorous",
    "romantic",
    "sarcasm",
    "suspenful",
  ]
  const randomOption =
    promptOptions[Random.integer(0, promptOptions.length - 1)]
  const prompt = `Read the following story and expand upon it in one or two sentences. Your response should be no longer than 20 words. Make sure the logic of the story is smooth. The plot should be ${randomOption}. Add a + sign at the beginning and end of your response: ${input}`
  return {
    version: "fbfb20b472b2f3bdd101412a9f70a0ed4fc0ced78a77ff00970ee7a2383c575d",
    input: {
      prompt: prompt,
      system_prompt: "You are a professional novel writter",
    },
  }
}

export const choicePrompt = (input: string): data => {
  const prompt = `Summerize the follow sentences into a short sentence less then 8 words. You should not alter the subject or the meaning of the sentence. Add a + sign at the beginning and end of your response: ${input}`
  return {
    version: "fbfb20b472b2f3bdd101412a9f70a0ed4fc0ced78a77ff00970ee7a2383c575d",
    input: {
      prompt: prompt,
    },
  }
}

export const initialPrompt = (): data => {
  const numbers = ["one", "two", "three", "a gourp of"]
  const characters = ["animal", "grown adult", "kid", "location"]
  const conditions = [
    "doing something",
    "and the surrounding environment",
    "and the weather",
  ]
  const settings = [
    "metropolis",
    "countryside",
    "medieval",
    "in the nature",
    "magical",
    "sci-fi",
    "warfare",
  ]
  const tones = [
    "everyday life",
    "suspenful",
    "exciting",
    "peaceful",
    "romantic",
  ]
  const [number, character, condition, setting, tone] = [
    numbers,
    characters,
    conditions,
    settings,
    tones,
  ].map((arr) => arr[Random.integer(0, arr.length - 1)])
  const prompt = `Write one sentence to describe ${number} ${character} ${condition}. The setting should ${setting} and the tone should be ${tone}. Add a + sign at the beginning and end of your response.`
  return {
    version: "fbfb20b472b2f3bdd101412a9f70a0ed4fc0ced78a77ff00970ee7a2383c575d",
    input: {
      prompt: prompt,
    },
  }
}
